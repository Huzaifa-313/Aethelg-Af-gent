# AETHELGARD MERGED FILE
# Origin Repository: Aethelgard Core
# Original Path: core/hunter/analyzer.py
# Merge Date: 2026-05-07T14:20:56Z
# ---

"""
Repository Analyzer for Agent Hunter
Analyzes discovered repositories for capabilities and integration potential.
"""

import os
import json
import ast
from pathlib import Path
from typing import List, Dict, Set, Tuple

class RepoAnalyzer:
    """Analyzes repository content for extractable capabilities."""
    
    def __init__(self, repo_path: str):
        self.repo_path = Path(repo_path)
        self.capabilities = []
        self.file_types = {}
        
    def analyze(self) -> Dict:
        """Perform full analysis of repository."""
        self._scan_file_types()
        self._extract_python_modules()
        self._extract_js_modules()
        self._find_configs()
        self._find_prompts()
        
        return {
            "capabilities": self.capabilities,
            "file_types": self.file_types,
            "total_files": sum(self.file_types.values()),
            "has_agent_code": self._has_agent_patterns(),
            "has_tools": self._has_tool_patterns(),
            "has_orchestration": self._has_orchestration_patterns()
        }
    
    def _scan_file_types(self):
        """Count files by extension."""
        for root, dirs, files in os.walk(self.repo_path):
            # Skip common non-source directories
            dirs[:] = [d for d in dirs if d not in {
                '.git', '__pycache__', 'node_modules', '.next', 
                'dist', 'build', '.venv', 'venv'
            }]
            
            for file in files:
                ext = Path(file).suffix.lower()
                if ext:
                    self.file_types[ext] = self.file_types.get(ext, 0) + 1
    
    def _extract_python_modules(self):
        """Extract importable Python modules and their capabilities."""
        for py_file in self.repo_path.rglob("*.py"):
            try:
                with open(py_file, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                # Parse AST
                tree = ast.parse(content)
                
                # Find classes and functions
                for node in ast.walk(tree):
                    if isinstance(node, ast.ClassDef):
                        self.capabilities.append({
                            "type": "class",
                            "name": node.name,
                            "file": str(py_file.relative_to(self.repo_path)),
                            "language": "python"
                        })
                    elif isinstance(node, ast.FunctionDef):
                        self.capabilities.append({
                            "type": "function",
                            "name": node.name,
                            "file": str(py_file.relative_to(self.repo_path)),
                            "language": "python"
                        })
                        
            except SyntaxError:
                continue
            except Exception:
                continue
    
    def _extract_js_modules(self):
        """Extract JavaScript/TypeScript modules."""
        for ext in ['*.js', '*.ts', '*.tsx', '*.jsx']:
            for js_file in self.repo_path.rglob(ext):
                try:
                    with open(js_file, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    
                    # Simple regex-based extraction for JS/TS
                    import re
                    
                    # Find exports
                    export_pattern = r'(?:export\s+(?:default\s+)?(?:class|function|const|let|var)\s+)(\w+)'
                    for match in re.finditer(export_pattern, content):
                        self.capabilities.append({
                            "type": "export",
                            "name": match.group(1),
                            "file": str(js_file.relative_to(self.repo_path)),
                            "language": "javascript"
                        })
                        
                except Exception:
                    continue
    
    def _find_configs(self):
        """Find configuration files that might contain agent settings."""
        config_files = [
            'config.json', 'settings.json', 'agent.json',
            'pyproject.toml', 'package.json', 'requirements.txt'
        ]
        
        for config_name in config_files:
            config_path = self.repo_path / config_name
            if config_path.exists():
                self.capabilities.append({
                    "type": "config",
                    "name": config_name,
                    "file": str(config_path.relative_to(self.repo_path)),
                    "language": "config"
                })
    
    def _find_prompts(self):
        """Find prompt templates and system instructions."""
        prompt_patterns = ['*.md', '*prompt*', '*system*', '*instructions*']
        for pattern in prompt_patterns:
            for file in self.repo_path.rglob(pattern):
                if file.is_file():
                    self.capabilities.append({
                        "type": "prompt",
                        "name": file.name,
                        "file": str(file.relative_to(self.repo_path)),
                        "language": "text"
                    })
    
    def _has_agent_patterns(self) -> bool:
        """Check if repository contains agent-related code patterns."""
        agent_keywords = ['agent', 'orchestrator', 'coordinator', 'planner', 'tool']
        
        for py_file in self.repo_path.rglob("*.py"):
            try:
                with open(py_file, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read().lower()
                    if any(kw in content for kw in agent_keywords):
                        return True
            except:
                continue
        return False
    
    def _has_tool_patterns(self) -> bool:
        """Check if repository contains tool definitions."""
        tool_keywords = ['tool', 'function', 'api', 'execute', 'run']
        
        for py_file in self.repo_path.rglob("*.py"):
            try:
                with open(py_file, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read().lower()
                    if any(kw in content for kw in tool_keywords):
                        return True
            except:
                continue
        return False
    
    def _has_orchestration_patterns(self) -> bool:
        """Check if repository contains workflow orchestration."""
        orch_keywords = ['workflow', 'graph', 'node', 'edge', 'dag', 'pipeline']
        
        for py_file in self.repo_path.rglob("*.py"):
            try:
                with open(py_file, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read().lower()
                    if any(kw in content for kw in orch_keywords):
                        return True
            except:
                continue
        return False
