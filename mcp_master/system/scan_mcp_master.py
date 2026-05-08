#!/usr/bin/env python3
"""
Mahoraga MCP Server - Phase 0 Scanner
Scans mcp_master directory and creates initial snapshot.
"""
import os
import json
import hashlib
from datetime import datetime
from pathlib import Path

MCP_ROOT = Path("c:\\Users\\Hashmi\\Desktop\\mycoder\\mcp_master")
SNAPSHOT_DIR = MCP_ROOT / "system" / "snapshot_initial"
OUTPUT_FILE = MCP_ROOT / "system" / "tool_inventory.json"

def sha256_file(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            h.update(chunk)
    return h.hexdigest()

def scan_mcp_master():
    """Scan all files in mcp_master and create inventory."""
    files = []
    protected = ['server.py', 'package.json', 'mcp_server_core.py', 'protocol_handler.py']
    
    for root, dirs, filenames in os.walk(MCP_ROOT):
        # Skip _mahoraga_sys directory
        if 'system' in root:
            continue
            
        for filename in filenames:
            filepath = Path(root) / filename
            try:
                stat = filepath.stat()
                size = stat.st_size
                
                # Count lines for text files
                line_count = 0
                if filepath.suffix.lower() in ('.py', '.js', '.ts', '.json', '.md', '.yaml', '.yml'):
                    try:
                        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                            line_count = sum(1 for _ in f)
                    except:
                        pass
                
                # Compute hash
                file_hash = sha256_file(filepath)
                
                # Get relative path
                rel_path = str(filepath.relative_to(MCP_ROOT)).replace('/', '\\')
                
                # Check if protected
                is_protected = any(p in rel_path for p in protected)
                
                file_entry = {
                    "path": rel_path,
                    "size": size,
                    "line_count": line_count,
                    "sha256": file_hash,
                    "is_protected_critical": is_protected,
                    "last_modified": datetime.fromtimestamp(stat.st_mtime).isoformat()
                }
                files.append(file_entry)
                
                # Copy to snapshot
                snapshot_path = SNAPSHOT_DIR / rel_path
                snapshot_path.parent.mkdir(parents=True, exist_ok=True)
                import shutil
                shutil.copy2(filepath, snapshot_path)
                
            except Exception as e:
                print(f"Error scanning {filepath}: {e}")
    
    return files

def main():
    print("Mahoraga Phase 0 - Scanning mcp_master...")
    print("=" * 60)
    
    files = scan_mcp_master()
    
    # Update tool_inventory.json
    with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
        inventory = json.load(f)
    
    inventory['tools'] = files
    inventory['total_tools'] = len(files)
    inventory['last_updated'] = datetime.now().isoformat()
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(inventory, f, indent=2)
    
    # Count protected files
    protected_count = sum(1 for f in files if f['is_protected_critical'])
    
    print(f"Scanned {len(files)} files")
    print(f"Protected critical files: {protected_count}")
    print(f"Snapshot created at: {SNAPSHOT_DIR}")
    print(f"Inventory updated: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
