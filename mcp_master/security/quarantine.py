# Mahoraga MCP Server - Quarantine Manager
# Handles infected file quarantine with logging#

import os
import shutil
from datetime import datetime
from pathlib import Path
from typing import Optional, List
import hashlib

def sha256_file(filepath: str) -> str:
    """Calculate SHA256 hash of a file."""
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b''):
            h.update(chunk)
    return h.hexdigest()

class QuarantineManager:
    """Manages quarantine operations for infected MCP tools."""
    
    def __init__(self, 
                 mcp_root: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\mcp_master",
                 quarantine_dir: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\mcp_master\\_mahoraga_sys\\quarantine_critical",
                 log_file: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\mcp_master\\_mahoraga_sys\\quarantine_log.txt"):
        self.mcp_root = Path(mcp_root)
        self.quarantine_dir = Path(quarantine_dir)
        self.log_file = log_file
        
        # Ensure directory exists
        self.quarantine_dir.mkdir(parents=True, exist_ok=True)
    
    def quarantine_file(self, scan_result, is_critical: bool = False) -> bool:
        """Move a file to quarantine."""
        source_path = Path(scan_result.filepath)
        
        if not source_path.exists():
            return False
        
        # Determine destination
        if is_critical:
            dest_dir = self.quarantine_dir
            prefix = "CRITICAL"
        else:
            dest_dir = self.mcp_root / "_mahoraga_sys" / "quarantine"
            prefix = "QUARANTINE"
        
        dest_dir.mkdir(parents=True, exist_ok=True)
        
        # Create quarantine filename
        quarantine_name = f"{source_path.name}.quarantine"
        dest_path = dest_dir / quarantine_name
        
        try:
            # Move file to quarantine
            shutil.move(str(source_path), str(dest_path))
            
            # Log the action
            self._log_quarantine(scan_result, is_critical, dest_path)
            
            return True
            
        except Exception as e:
            self._log_error(f"Failed to quarantine {source_path}: {e}")
            return False
    
    def _log_quarantine(self, scan_result, is_critical: bool, dest_path: Path):
        """Log quarantine action."""
        timestamp = datetime.now().isoformat()
        level = "CRITICAL" if is_critical else "INFECTED"
        
        log_entry = f"""
{'='*60}
[{timestamp}] {level} FILE QUARANTINED
{'='*60}
File: {scan_result.filepath}
Threat Level: {scan_result.threat_level.value}
Entropy: {scan_result.entropy:.2f}
Findings:
"""
        for finding in scan_result.findings:
            log_entry += f"  - {finding}\n"
        
        log_entry += f"Quarantine Location: {dest_path}\n"
        
        if is_critical:
            log_entry += "NOTE: System-critical file - requires human review\n"
        
        with open(self.log_file, 'a', encoding='utf-8') as f:
            f.write(log_entry)
    
    def _log_error(self, message: str):
        """Log an error."""
        timestamp = datetime.now().isoformat()
        with open(self.log_file, 'a', encoding='utf-8') as f:
            f.write(f"[{timestamp}] ERROR: {message}\n")
    
    def list_quarantined(self) -> List[dict]:
        """List all quarantined files."""
        files = []
        
        # Check both quarantine directories
        quarantine_dirs = [
            self.mcp_root / "_mahoraga_sys" / "quarantine",
            self.quarantine_dir
        ]
        
        for q_dir in quarantine_dirs:
            if not q_dir.exists():
                continue
            for file in q_dir.glob("*.quarantine"):
                files.append({
                    "name": file.name,
                    "path": str(file),
                    "is_critical": q_dir == self.quarantine_dir,
                    "quarantined_at": datetime.fromtimestamp(file.stat().st_mtime).isoformat()
                })
        
        return files
