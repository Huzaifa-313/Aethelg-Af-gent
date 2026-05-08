# AETHELGARD MERGED FILE
# Origin Repository: Aethelgard Core
# Original Path: core/safety/scanner.py
# Merge Date: 2026-05-07T14:24:22Z
# ---

"""
Virus Detection Scanner - Layer 1
Signature and heuristic-based malware detection.
"""

import re
import math
import hashlib
from pathlib import Path
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
from enum import Enum

class ThreatLevel(Enum):
    CLEAN = "clean"
    SUSPICIOUS = "suspicious"
    INFECTED = "infected"
    CRITICAL = "critical"

@dataclass
class ScanResult:
    filepath: str
    threat_level: ThreatLevel
    findings: List[str]
    entropy: float
    is_system_critical: bool = False
    recommendation: str = ""

class SignatureScanner:
    """Scans files for known malware signatures."""
    
    # Known malware signatures (simplified for demonstration)
    MALWARE_SIGNATURES = {
        'eval_base64': r'eval\s*\(\s*base64_decode\s*\(',
        'exec_remote': r'os\.system\s*\(\s*["\']https?://',
        'shell_exec': r'shell_exec\s*\(',
        'proc_inject': r'VirtualAllocEx|WriteProcessMemory|CreateRemoteThread',
        'privilege_escalation': r'AdjustTokenPrivileges|SeDebugPrivilege',
        'ransomware_pattern': r'\.encrypt\(.*\.decrypt\(.*\. ransom',
        'backdoor_bind': r'socket\.bind\(\s*["\']0\.0\.0\.0',
        'c2_pattern': r'connect\(.*\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}',
        'obfuscated_js': r'eval\s*\(\s*function\s*\(\s*\)\s*\{.*\}\s*\)',
        'powershell_encoded': r'powershell\s+-enc\s+',
        'cmd_obfuscation': r'cmd\s+/c\s+.*%[0-9a-f]{2}',
        'registry_persistence': r'HKEY_.*\\Run',
        'keylogger': r'GetAsyncKeyState|SetWindowsHookEx',
        'screenshot': r'BitBlt|PrintWindow|GetDC',
        'clipboard_steal': r'OpenClipboard|GetClipboardData',
        'credential_dump': r'lsass\.exe|mimikatz|sekurlsa',
    }
    
    def __init__(self):
        self.compiled_patterns = {
            name: re.compile(pattern, re.IGNORECASE) 
            for name, pattern in self.MALWARE_SIGNATURES.items()
        }
    
    def scan_file(self, filepath: str) -> ScanResult:
        """Scan a single file for malware signatures."""
        path = Path(filepath)
        
        if not path.exists():
            return ScanResult(filepath, ThreatLevel.CLEAN, [], 0.0)
        
        try:
            with open(path, 'rb') as f:
                content = f.read()
        except Exception:
            return ScanResult(filepath, ThreatLevel.CLEAN, [], 0.0)
        
        # Calculate entropy
        entropy = self._calculate_entropy(content)
        
        findings = []
        threat_level = ThreatLevel.CLEAN
        
        # Check signatures
        for name, pattern in self.compiled_patterns.items():
            try:
                if pattern.search(content.decode('utf-8', errors='ignore')):
                    findings.append(f"Signature match: {name}")
                    if threat_level == ThreatLevel.CLEAN:
                        threat_level = ThreatLevel.INFECTED
            except:
                continue
        
        # Check for high entropy (possible obfuscation)
        if entropy > 7.5:
            findings.append(f"High entropy: {entropy:.2f} (possible obfuscation)")
            if threat_level == ThreatLevel.CLEAN:
                threat_level = ThreatLevel.SUSPICIOUS
        
        # Check for shellcode patterns
        if self._has_shellcode(content):
            findings.append("Potential shellcode detected")
            threat_level = ThreatLevel.CRITICAL
        
        return ScanResult(
            filepath=filepath,
            threat_level=threat_level,
            findings=findings,
            entropy=entropy
        )
    
    def _calculate_entropy(self, data: bytes) -> float:
        """Calculate Shannon entropy of data."""
        if not data:
            return 0.0
        
        entropy = 0.0
        for x in range(256):
            p_x = data.count(bytes([x])) / len(data)
            if p_x > 0:
                entropy += -p_x * math.log2(p_x)
        
        return entropy
    
    def _has_shellcode(self, data: bytes) -> bool:
        """Check for common shellcode patterns."""
        # Common shellcode prefixes
        shellcode_prefixes = [
            b'\x90\x90\x90',  # NOP sled
            b'\xeb\xfe',       # Infinite loop
            b'\xe8\x00\x00\x00\x00',  # Call next instruction
        ]
        
        for prefix in shellcode_prefixes:
            if prefix in data:
                return True
        
        return False

class HeuristicScanner:
    """Heuristic-based scanning for suspicious behavior patterns."""
    
    SUSPICIOUS_PATTERNS = {
        'network_communication': r'(socket|urllib|requests)\.(connect|get|post|open)',
        'file_manipulation': r'open\(.*[\"\']w[\"\'].*\)|write\(|delete\(|remove\(',
        'process_creation': r'subprocess\.(Popen|run|call)|os\.system\(|exec\(',
        'registry_access': r'winreg|_winreg|HKEY_',
        'crypto_operations': r'cryptography|Crypto|hashlib\.(md5|sha)',
        'persistence': r'schedule|cron|taskscheduler',
        'obfuscation': r'base64\.(b64encode|b64decode)|zlib\.(compress|decompress)',
        'anti_debug': r'IsDebuggerPresent|CheckRemoteDebuggerPresent',
    }
    
    def __init__(self):
        self.compiled_patterns = {
            name: re.compile(pattern, re.IGNORECASE)
            for name, pattern in self.SUSPICIOUS_PATTERNS.items()
        }
    
    def scan_file(self, filepath: str) -> ScanResult:
        """Scan file for heuristic suspicious patterns."""
        path = Path(filepath)
        
        if not path.exists():
            return ScanResult(filepath, ThreatLevel.CLEAN, [], 0.0)
        
        try:
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
        except Exception:
            return ScanResult(filepath, ThreatLevel.CLEAN, [], 0.0)
        
        findings = []
        threat_level = ThreatLevel.CLEAN
        
        for name, pattern in self.compiled_patterns.items():
            matches = pattern.findall(content)
            if matches:
                findings.append(f"Heuristic: {name} ({len(matches)} matches)")
                if threat_level == ThreatLevel.CLEAN:
                    threat_level = ThreatLevel.SUSPICIOUS
        
        # Check for suspicious imports
        suspicious_imports = self._check_imports(content)
        if suspicious_imports:
            findings.extend(suspicious_imports)
            if threat_level == ThreatLevel.CLEAN:
                threat_level = ThreatLevel.SUSPICIOUS
        
        return ScanResult(
            filepath=filepath,
            threat_level=threat_level,
            findings=findings,
            entropy=0.0
        )
    
    def _check_imports(self, content: str) -> List[str]:
        """Check for suspicious imports."""
        suspicious = []
        
        # Python suspicious imports
        python_suspicious = [
            'ctypes', 'mmap', 'fcntl', 'pty', 'resource',
            'winreg', '_winreg', 'msvcrt', 'winsound'
        ]
        
        for module in python_suspicious:
            if f'import {module}' in content or f'from {module}' in content:
                suspicious.append(f"Suspicious import: {module}")
        
        return suspicious
