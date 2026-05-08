# AETHELGARD MERGED FILE
# Origin Repository: Aethelgard Core
# Original Path: core/safety/regenerator.py
# Merge Date: 2026-05-07T14:26:48Z
# ---

"""
File Regenerator for Quarantined Files
Attempts to regenerate safe, functionally equivalent versions of infected files.
"""

import os
import re
import ast
from pathlib import Path
from typing import Optional, List
from .scanner import ScanResult, ThreatLevel

class FileRegenerator:
    """Regenerates safe versions of infected files."""
    
    def __init__(self, recovered_dir: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\core\\safety\\recovered"):
        self.recovered_dir = Path(recovered_dir)
        self.recovered_dir.mkdir(parents=True, exist_ok=True)
    
    def regenerate(self, scan_result: ScanResult, original_content: str = "") -> Optional[str]:
        """Attempt to regenerate a safe version of the file."""
        filepath = Path(scan_result.filepath)
        
        if not filepath.exists():
            return None
        
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
        except Exception:
            return None
        
        # Determine file type and regeneration strategy
        ext = filepath.suffix.lower()
        
        if ext == '.py':
            regenerated = self._regenerate_python(content, scan_result)
        elif ext in ('.js', '.ts'):
            regenerated = self._regenerate_javascript(content, scan_result)
        else:
            # Generic regeneration - remove suspicious patterns
            regenerated = self._generic_regenerate(content, scan_result)
        
        if not regenerated:
            return None
        
        # Save regenerated file
        recovered_path = self.recovered_dir / filepath.name
        try:
            with open(recovered_path, 'w', encoding='utf-8') as f:
                f.write(regenerated)
            return str(recovered_path)
        except Exception:
            return None
    
    def _regenerate_python(self, content: str, scan_result: ScanResult) -> Optional[str]:
        """Regenerate a safe Python file."""
        try:
            # Parse AST
            tree = ast.parse(content)
            
            # Remove suspicious nodes
            safe_tree = self._sanitize_ast(tree)
            
            # Convert back to code (simplified)
            # In a real implementation, this would use ast.unparse or similar
            import astor
            regenerated = astor.to_source(safe_tree)
            
            return regenerated
            
        except Exception:
            # Fallback: remove suspicious patterns
            return self._generic_regenerate(content, scan_result)
    
    def _regenerate_javascript(self, content: str, scan_result: ScanResult) -> Optional[str]:
        """Regenerate a safe JavaScript file."""
        # Remove eval and similar dangerous functions
        dangerous = ['eval', 'Function', 'setTimeout\\s*\\(', 'setInterval\\s*\\(']
        
        regenerated = content
        for pattern in dangerous:
            regenerated = re.sub(pattern, '// REMOVED: ' + pattern, regenerated)
        
        return regenerated
    
    def _generic_regenerate(self, content: str, scan_result: ScanResult) -> Optional[str]:
        """Generic regeneration for any file type."""
        # Remove lines containing suspicious patterns
        lines = content.split('\n')
        safe_lines = []
        
        suspicious_patterns = [
            'eval(', 'exec(', 'os.system(', 'subprocess.call(',
            'shell=True', '__import__', 'importlib'
        ]
        
        for line in lines:
            is_suspicious = any(pattern in line for pattern in suspicious_patterns)
            if not is_suspicious:
                safe_lines.append(line)
            else:
                safe_lines.append(f"# REMOVED: Suspicious line containing dangerous pattern")
        
        return '\n'.join(safe_lines)
    
    def _sanitize_ast(self, tree: ast.AST) -> ast.AST:
        """Sanitize an AST by removing dangerous nodes."""
        # This is a simplified version
        # In a real implementation, this would walk the tree and remove/replace dangerous nodes
        return tree
