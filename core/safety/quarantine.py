# AETHELGARD MERGED FILE
# Origin Repository: Aethelgard Core
# Original Path: core/safety/quarantine.py
# Merge Date: 2026-05-07T14:26:04Z
# ---

"""
Quarantine Manager for Virus Detection
Handles quarantining of infected files with proper logging.
"""

import os
import shutil
from datetime import datetime
from pathlib import Path
from typing import Optional
from .scanner import ScanResult, ThreatLevel

class QuarantineManager:
    """Manages quarantine operations for infected files."""
    
    def __init__(self, 
                 quarantine_dir: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\_aethelgard_safety\\quarantine",
                 critical_dir: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\_aethelgard_safety\\quarantine_critical",
                 log_file: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\_aethelgard_safety\\quarantine_log.txt"):
        self.quarantine_dir = Path(quarantine_dir)
        self.critical_dir = Path(critical_dir)
        self.log_file = log_file
        
        # Ensure directories exist
        self.quarantine_dir.mkdir(parents=True, exist_ok=True)
        self.critical_dir.mkdir(parents=True, exist_ok=True)
    
    def quarantine_file(self, scan_result: ScanResult, is_critical: bool = False) -> bool:
        """Move a file to quarantine."""
        source_path = Path(scan_result.filepath)
        
        if not source_path.exists():
            return False
        
        # Determine destination
        if is_critical:
            dest_dir = self.critical_dir
            prefix = "CRITICAL"
        else:
            dest_dir = self.quarantine_dir
            prefix = "QUARANTINE"
        
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
    
    def _log_quarantine(self, scan_result: ScanResult, is_critical: bool, dest_path: Path):
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
    
    def list_quarantined(self) -> list:
        """List all quarantined files."""
        files = []
        
        for q_dir in [self.quarantine_dir, self.critical_dir]:
            for file in q_dir.glob("*.quarantine"):
                files.append({
                    "name": file.name,
                    "path": str(file),
                    "is_critical": q_dir == self.critical_dir,
                    "quarantined_at": datetime.fromtimestamp(file.stat().st_mtime).isoformat()
                })
        
        return files
