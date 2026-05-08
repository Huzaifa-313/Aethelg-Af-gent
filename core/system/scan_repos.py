#!/usr/bin/env python3
"""
Aethelgard Source Repository Scanner
Scans all folders in the project root (excluding core, mcp_master, _aethelgard_safety, .git)
and creates repo_sources.json with repository metadata.
"""
import os
import json
from datetime import datetime
from pathlib import Path

PROJECT_ROOT = Path("c:\\Users\\Hashmi\\Desktop\\mycoder")
OUTPUT_FILE = PROJECT_ROOT / "core" / "system" / "repo_sources.json"

EXCLUDED_DIRS = {
    'core',
    'mcp_master',
    'core',
    '.git',
    '.roo',
    '_safety',
    'extraction',
    'mcp'
}

def classify_repo(name, files):
    """Classify repository based on name and file types."""
    name_lower = name.lower()
    
    # Check for agent-related keywords
    agent_keywords = ['agent', 'manus', 'jarvis', 'claude', 'ai', 'bot', 'assistant']
    if any(kw in name_lower for kw in agent_keywords):
        return 'agent'
    
    # Check for automation
    auto_keywords = ['automation', 'pilot', 'labs', 'pc-', 'auto']
    if any(kw in name_lower for kw in auto_keywords):
        return 'automation'
    
    # Check for tools/utilities
    tool_keywords = ['tool', 'kit', 'cache', 'utils']
    if any(kw in name_lower for kw in tool_keywords):
        return 'utility'
    
    # Check for UI
    ui_keywords = ['web', 'ui', 'app', 'interface']
    if any(kw in name_lower for kw in ui_keywords):
        return 'ui'
    
    # Check for privacy/security
    privacy_keywords = ['privacy', 'uncensored', 'security']
    if any(kw in name_lower for kw in privacy_keywords):
        return 'privacy'
    
    return 'other'

def scan_repos():
    repos = []
    
    for item in PROJECT_ROOT.iterdir():
        if not item.is_dir():
            continue
        
        if item.name in EXCLUDED_DIRS or item.name.startswith('.'):
            continue
        
        # Count files recursively
        file_count = 0
        total_size = 0
        file_types = {}
        
        for root, dirs, files in os.walk(item):
            for f in files:
                filepath = Path(root) / f
                try:
                    stat = filepath.stat()
                    size = stat.st_size
                    total_size += size
                    file_count += 1
                    
                    ext = filepath.suffix.lower()
                    if ext:
                        file_types[ext] = file_types.get(ext, 0) + 1
                except:
                    pass
        
        classification = classify_repo(item.name, file_types)
        
        repo_entry = {
            "name": item.name,
            "path": str(item.relative_to(PROJECT_ROOT)).replace('/', '\\'),
            "classification": classification,
            "file_count": file_count,
            "total_size_bytes": total_size,
            "file_types": file_types,
            "scan_date": datetime.now().isoformat()
        }
        repos.append(repo_entry)
        print(f"Scanned: {item.name} ({file_count} files, {total_size} bytes) -> {classification}")
    
    # Sort by classification
    repos.sort(key=lambda x: (x['classification'], x['name']))
    
    output = {
        "metadata": {
            "description": "Source repositories available for merging into core/",
            "created": datetime.now().isoformat(),
            "project_root": str(PROJECT_ROOT),
            "total_repos": len(repos)
        },
        "repositories": repos
    }
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2)
    
    print(f"\nScanned {len(repos)} repositories")
    print(f"Output saved to: {OUTPUT_FILE}")
    return output

if __name__ == "__main__":
    scan_repos()
