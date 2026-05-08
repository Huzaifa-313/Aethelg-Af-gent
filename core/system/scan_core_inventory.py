#!/usr/bin/env python3
"""
Aethelgard Core Inventory Scanner
Scans the core/ directory and generates gold_inventory.json with file metadata.
"""
import os
import json
import hashlib
from datetime import datetime
from pathlib import Path

PROJECT_ROOT = Path("c:\\Users\\Hashmi\\Desktop\\mycoder")
CORE_DIR = PROJECT_ROOT / "core"
OUTPUT_FILE = PROJECT_ROOT / "core" / "system" / "gold_inventory.json"

def get_file_type(filepath):
    ext = filepath.suffix.lower()
    type_map = {
        '.py': 'python',
        '.ts': 'typescript',
        '.js': 'javascript',
        '.json': 'json',
        '.md': 'markdown',
        '.rs': 'rust',
        '.toml': 'config',
        '.yml': 'config',
        '.yaml': 'config',
        '.txt': 'text',
        '.html': 'html',
        '.css': 'css',
        '.tsx': 'typescript-react',
        '.jsx': 'javascript-react',
    }
    return type_map.get(ext, 'unknown')

def guess_purpose(filepath, line_count):
    name = filepath.name.lower()
    if 'test' in name:
        return 'test_suite'
    elif 'config' in name or '.config.' in name:
        return 'configuration'
    elif 'coordinator' in name:
        return 'agent_coordination'
    elif 'tool' in name:
        return 'tool_management'
    elif 'agent' in name:
        return 'agent_logic'
    elif 'orchestr' in name:
        return 'orchestration'
    elif 'daemon' in name:
        return 'background_service'
    elif 'utils' in name or 'util' in name:
        return 'utility'
    elif 'types' in name:
        return 'type_definitions'
    elif 'schema' in name:
        return 'schema_definition'
    elif 'executor' in name:
        return 'execution_engine'
    elif 'loader' in name:
        return 'module_loader'
    elif 'builtin' in name:
        return 'builtin_tools'
    elif 'chat' in name:
        return 'chat_integration'
    elif 'triggers' in name:
        return 'event_triggers'
    elif 'undercover' in name:
        return 'stealth_mode'
    elif 'privacy' in name:
        return 'privacy_protection'
    elif 'voice' in name:
        return 'voice_mode'
    elif 'vim' in name:
        return 'vim_integration'
    elif 'index' in name:
        return 'module_index'
    elif line_count < 20:
        return 'minimal_module'
    else:
        return 'general_module'

def sha256_file(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            h.update(chunk)
    return h.hexdigest()

def scan_core():
    files = []
    total_size = 0
    
    for root, dirs, filenames in os.walk(CORE_DIR):
        for filename in filenames:
            filepath = Path(root) / filename
            try:
                stat = filepath.stat()
                size = stat.st_size
                mtime = stat.st_mtime
                
                # Count lines
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        line_count = sum(1 for _ in f)
                except:
                    line_count = 0
                
                # Compute hash
                try:
                    file_hash = sha256_file(filepath)
                except:
                    file_hash = "ERROR"
                
                rel_path = str(filepath.relative_to(PROJECT_ROOT)).replace('/', '\\')
                
                file_entry = {
                    "path": rel_path,
                    "size": size,
                    "last_modified": datetime.fromtimestamp(mtime).isoformat(),
                    "sha256": file_hash,
                    "line_count": line_count,
                    "file_type": get_file_type(filepath),
                    "purpose": guess_purpose(filepath, line_count)
                }
                files.append(file_entry)
                total_size += size
            except Exception as e:
                print(f"Error scanning {filepath}: {e}")
    
    inventory = {
        "metadata": {
            "description": "Baseline inventory of core/ directory - GOLD ZONE protection",
            "created": datetime.now().isoformat(),
            "project_root": str(PROJECT_ROOT),
            "gold_zone": str(CORE_DIR),
            "read_only_reference": str(PROJECT_ROOT / "mcp_master"),
            "total_files": len(files),
            "total_size_bytes": total_size
        },
        "files": files
    }
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(inventory, f, indent=2)
    
    print(f"Scanned {len(files)} files in core/")
    print(f"Total size: {total_size} bytes")
    print(f"Inventory saved to: {OUTPUT_FILE}")
    return inventory

if __name__ == "__main__":
    scan_core()
