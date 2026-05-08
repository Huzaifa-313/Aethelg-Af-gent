# Mahoraga MCP Server - Repository Analyzer
# Analyzes discovered repositories for MCP tool compatibility

import os
import json
import ast
from pathlib import Path
from typing import List, Dict, Optional

class RepoAnalyzer:
    """Analyzes repository content for MCP tool capabilities."""
    
    MCP_INDICATORS = [
        'mcp', 'model-context-protocol', 'server',
        'tool', 'resource', 'prompt', 'sampling'
    ]
    
    def __init__(self, repo_path: str):
        self.repo_path = Path(repo_path)
        self.capabilities = []
        self.mcp_files = []
        
    def analyze(self) -> Dict:
        """Perform full analysis of repository for MCP compatibility."""
        self._find_mcp_files()
        self._extract_tool_definitions()
        self._check_manifest()
        self._analyze_tool_schemas()
        
        return {
            "is_mcp_compatible": self._is_mcp_compatible(),
            "mcp_files": self.mcp_files,
            "tool_count": len([c for c in self.capabilities if c['type'] == 'tool']),
            "capabilities": self.capabilities,
            "has_manifest": self._has_manifest(),
            "has_tool_schema": self._has_tool_schema(),
            "total_files": self._count_files()
        }
    
    def _find_mcp_files(self):
        """Find files that indicate MCP compatibility."""
        for pattern in ['*.py', '*.js', '*.ts', '*.json']:
            for file in self.repo_path.rglob(pattern):
                try:
                    with open(file, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read().lower()
                    
                    # Check for MCP indicators
                    if any(indicator in content for indicator in self.MCP_INDICATORS):
                        self.mcp_files.append(str(file.relative_to(self.repo_path)))
                        
                except Exception:
                    continue
    
    def _extract_tool_definitions(self):
        """Extract tool definitions from Python files."""
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
                            "is_tool": self._is_tool_class(node)
                        })
                    elif isinstance(node, ast.FunctionDef):
                        self.capabilities.append({
                            "type": "function",
                            "name": node.name,
                            "file": str(py_file.relative_to(self.repo_path)),
                            "is_tool": self._is_tool_function(node)
                        })
                        
            except SyntaxError:
                continue
            except Exception:
                continue
    
    def _is_tool_class(self, node: ast.ClassDef) -> bool:
        """Check if a class is likely an MCP tool."""
        tool_indicators = ['tool', 'mcp', 'server', 'handler']
        class_name = node.name.lower()
        
        if any(indicator in class_name for indicator in tool_indicators):
            return True
        
        # Check base classes
        for base in node.bases:
            if isinstance(base, ast.Name) and any(ind in base.id.lower() for ind in tool_indicators):
                return True
        
        return False
    
    def _is_tool_function(self, node: ast.FunctionDef) -> bool:
        """Check if a function is likely an MCP tool."""
        tool_indicators = ['tool', 'execute', 'run', 'handle', 'process']
        func_name = node.name.lower()
        
        return any(indicator in func_name for indicator in tool_indicators)
    
    def _check_manifest(self):
        """Check for manifest.json or similar MCP manifest files."""
        manifest_names = ['manifest.json', 'mcp-manifest.json', 'server.json']
        
        for manifest in manifest_names:
            manifest_path = self.repo_path / manifest
            if manifest_path.exists():
                try:
                    with open(manifest_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        self.capabilities.append({
                            "type": "manifest",
                            "name": manifest,
                            "file": manifest,
                            "content": data
                        })
                except Exception:
                    pass
    
    def _analyze_tool_schemas(self):
        """Analyze tool schemas for MCP compliance."""
        for py_file in self.repo_path.rglob("*.py"):
            try:
                with open(py_file, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                # Look for JSON schema definitions
                if 'schema' in content.lower() or 'inputSchema' in content:
                    self.capabilities.append({
                        "type": "schema",
                        "file": str(py_file.relative_to(self.repo_path)),
                        "has_schema": True
                    })
                    
            except Exception:
                continue
    
    def _is_mcp_compatible(self) -> bool:
        """Determine if repository is MCP-compatible."""
        return len(self.mcp_files) > 0 or self._has_manifest()
    
    def _has_manifest(self) -> bool:
        """Check if repository has an MCP manifest."""
        manifest_names = ['manifest.json', 'mcp-manifest.json', 'server.json']
        return any((self.repo_path / m).exists() for m in manifest_names)
    
    def _has_tool_schema(self) -> bool:
        """Check if repository has tool schemas."""
        return any(c['type'] == 'schema' for c in self.capabilities)
    
    def _count_files(self) -> int:
        """Count total files in repository."""
        count = 0
        for _ in self.repo_path.rglob("*"):
            count += 1
        return count
