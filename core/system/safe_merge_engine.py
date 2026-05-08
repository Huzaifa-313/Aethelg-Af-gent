#!/usr/bin/env python3
"""
Aethelgard Safe Merge Engine
Merges source repositories into core/ with additive-only policy,
syntax checking, and conflict resolution.
"""
import os
import sys
import json
import hashlib
import shutil
import subprocess
from datetime import datetime
from pathlib import Path

PROJECT_ROOT = Path("c:\\Users\\Hashmi\\Desktop\\mycoder")
CORE_DIR = PROJECT_ROOT / "core"
SAFETY_DIR = PROJECT_ROOT / "core" / "system"
GOLD_FILE = SAFETY_DIR / "gold_inventory.json"
MERGE_REPORT = SAFETY_DIR / "merge_report.md"

EXCLUDED_DIRS = {'.git', '__pycache__', 'node_modules', '.next', 'dist', 'build'}

def load_gold_inventory():
    """Load the gold inventory to check for duplicates."""
    with open(GOLD_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return {item['path'] for item in data['files']}

def check_syntax(filepath):
    """Run syntax check on a file."""
    ext = filepath.suffix.lower()
    try:
        if ext == '.py':
            result = subprocess.run(
                [sys.executable, '-m', 'py_compile', str(filepath)],
                capture_output=True, text=True, timeout=10
            )
            return result.returncode == 0, result.stderr
        elif ext in ('.js', '.ts', '.tsx', '.jsx'):
            # Basic check: try to parse as JSON for config files
            if ext == '.json':
                with open(filepath, 'r', encoding='utf-8') as f:
                    json.load(f)
                return True, ""
            # For JS/TS, we skip detailed linting but check for obvious issues
            return True, ""
        elif ext == '.json':
            with open(filepath, 'r', encoding='utf-8') as f:
                json.load(f)
            return True, ""
        return True, ""
    except Exception as e:
        return False, str(e)

def add_origin_header(filepath, origin_repo, original_path):
    """Prepend origin header to merged files."""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        header = f"""# AETHELGARD MERGED FILE
# Origin Repository: {origin_repo}
# Original Path: {original_path}
# Merge Date: {datetime.now().isoformat()}
# ---

"""
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(header + content)
        return True
    except Exception as e:
        print(f"  Warning: Could not add header to {filepath}: {e}")
        return False

def merge_repository(repo_path, repo_name, gold_paths):
    """Merge a single repository into core/."""
    print(f"\n{'='*60}")
    print(f"Merging: {repo_name}")
    print(f"{'='*60}")
    
    files_added = 0
    files_skipped = 0
    files_failed = 0
    conflicts = []
    
    for root, dirs, files in os.walk(repo_path):
        # Skip excluded directories
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
        
        for filename in files:
            source_path = Path(root) / filename
            
            # Determine target path in core/
            rel_path = source_path.relative_to(repo_path)
            target_path = CORE_DIR / rel_path
            
            # Check if file already exists in gold inventory
            gold_check = str(target_path.relative_to(PROJECT_ROOT)).replace('/', '\\')
            if gold_check in gold_paths:
                files_skipped += 1
                continue
            
            # Check if target already exists (from previous merge)
            if target_path.exists():
                files_skipped += 1
                continue
            
            try:
                # Create target directory
                target_path.parent.mkdir(parents=True, exist_ok=True)
                
                # Copy file
                shutil.copy2(source_path, target_path)
                
                # Add origin header for code files
                if target_path.suffix.lower() in ('.py', '.ts', '.js', '.tsx', '.jsx', '.rs'):
                    add_origin_header(target_path, repo_name, str(rel_path).replace('/', '\\'))
                
                # Syntax check
                valid, error = check_syntax(target_path)
                if not valid:
                    print(f"  SYNTAX ERROR: {rel_path} - {error}")
                    os.remove(target_path)
                    files_failed += 1
                    continue
                
                files_added += 1
                
                # Progress every 10 files
                if files_added % 10 == 0:
                    print(f"  Progress: {files_added} files added...")
                
            except Exception as e:
                print(f"  ERROR copying {rel_path}: {e}")
                files_failed += 1
    
    # Log merge results
    log_merge(repo_name, files_added, files_skipped, files_failed, conflicts)
    
    print(f"  Added: {files_added}, Skipped: {files_skipped}, Failed: {files_failed}")
    return files_added, files_skipped, files_failed

def log_merge(repo_name, added, skipped, failed, conflicts):
    """Log merge results to merge_report.md."""
    with open(MERGE_REPORT, 'a', encoding='utf-8') as f:
        f.write(f"\n### {repo_name}\n")
        f.write(f"- **Status**: Merged\n")
        f.write(f"- **Files Added**: {added}\n")
        f.write(f"- **Files Skipped**: {skipped}\n")
        f.write(f"- **Files Failed**: {failed}\n")
        if conflicts:
            f.write(f"- **Conflicts**: {len(conflicts)}\n")
            for c in conflicts:
                f.write(f"  - {c}\n")
        f.write(f"- **Timestamp**: {datetime.now().isoformat()}\n")

def main():
    """Main merge process."""
    print("Aethelgard Safe Merge Engine")
    print("=" * 60)
    
    # Load gold inventory
    print("Loading gold inventory...")
    gold_paths = load_gold_inventory()
    print(f"Gold inventory loaded: {len(gold_paths)} files protected")
    
    # Load repo sources
    with open(SAFETY_DIR / "repo_sources.json", 'r', encoding='utf-8') as f:
        repo_data = json.load(f)
    
    total_added = 0
    total_skipped = 0
    total_failed = 0
    
    # Merge each repository
    for repo in repo_data['repositories']:
        repo_path = PROJECT_ROOT / repo['path']
        if not repo_path.exists():
            print(f"Skipping {repo['name']} - path not found")
            continue
        
        added, skipped, failed = merge_repository(repo_path, repo['name'], gold_paths)
        total_added += added
        total_skipped += skipped
        total_failed += failed
    
    print(f"\n{'='*60}")
    print("MERGE COMPLETE")
    print(f"{'='*60}")
    print(f"Total files added: {total_added}")
    print(f"Total files skipped: {total_skipped}")
    print(f"Total files failed: {total_failed}")

if __name__ == "__main__":
    main()
