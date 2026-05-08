"""
ToolExposer - Exposes all integrated tools as standard MCP tools with JSON schemas.
Handles tool discovery, schema generation, and tool execution.
"""

import json
import logging
import os
import sys
from typing import Any, Dict, List, Optional
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

logger = logging.getLogger(__name__)


class ToolExposer:
    """
    Exposes tools as standard MCP tools.
    
    Responsibilities:
    - Discover all tools in mcp_master (core_tools, custom_tools, agent_tools)
    - Generate MCP-compliant JSON schemas for each tool
    - Handle tool execution requests
    - Maintain tool inventory
    """
    
    def __init__(self):
        """Initialize the tool exposer."""
        self.mcp_master_path = Path(__file__).parent.parent
        self.tool_cache = {}
        self.inventory_path = self.mcp_master_path / "_mahoraga_sys" / "tool_inventory.json"
        
        # Load or create tool inventory
        self._load_inventory()
        
        logger.info(f"ToolExposer initialized with {len(self.tool_cache)} tools cached")
    
    def _load_inventory(self):
        """Load tool inventory from JSON file."""
        try:
            if self.inventory_path.exists():
                with open(self.inventory_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    tools_data = data.get("tools", {})
                    # Handle both dict and list formats
                    if isinstance(tools_data, list):
                        # Convert list to dict with path as key
                        self.tool_cache = {}
                        for tool in tools_data:
                            path = tool.get("path", "")
                            if path:
                                self.tool_cache[path] = {
                                    "name": path.split("\\")[-1] if path else "unknown",
                                    "category": "scanned",
                                    "path": path,
                                    "description": "",
                                    "mcp_compatible": False
                                }
                    else:
                        self.tool_cache = tools_data
            else:
                self.tool_cache = {}
                self._save_inventory()
        except Exception as e:
            logger.error(f"Failed to load inventory: {e}")
            self.tool_cache = {}
    
    def _save_inventory(self):
        """Save tool inventory to JSON file."""
        try:
            inventory_data = {
                "metadata": {
                    "total_tools": len(self.tool_cache),
                    "last_updated": self._get_timestamp()
                },
                "tools": self.tool_cache
            }
            with open(self.inventory_path, 'w', encoding='utf-8') as f:
                json.dump(inventory_data, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to save inventory: {e}")
    
    def _get_timestamp(self) -> str:
        """Get current timestamp string."""
        from datetime import datetime
        return datetime.utcnow().isoformat()
    
    def discover_tools(self) -> List[Dict[str, Any]]:
        """
        Discover all tools in mcp_master directory.
        Scans core_tools, custom_tools, and agent_tools directories.
        """
        discovered_tools = []
        
        # Scan core_tools
        core_tools_path = self.mcp_master_path / "core_tools"
        if core_tools_path.exists():
            discovered_tools.extend(self._scan_tool_directory(core_tools_path, "core"))
        
        # Scan custom_tools
        custom_tools_path = self.mcp_master_path / "custom_tools"
        if custom_tools_path.exists():
            discovered_tools.extend(self._scan_tool_directory(custom_tools_path, "custom"))
        
        # Scan agent_tools
        agent_tools_path = self.mcp_master_path / "agent_tools"
        if agent_tools_path.exists():
            discovered_tools.extend(self._scan_tool_directory(agent_tools_path, "agent"))
        
        # Update cache
        for tool in discovered_tools:
            tool_id = f"{tool['category']}/{tool['name']}"
            self.tool_cache[tool_id] = tool
        
        self._save_inventory()
        
        logger.info(f"Discovered {len(discovered_tools)} tools")
        return discovered_tools
    
    def _scan_tool_directory(self, directory: Path, category: str) -> List[Dict[str, Any]]:
        """Scan a directory for MCP tools."""
        tools = []
        
        # Look for manifest.json files
        for manifest_file in directory.rglob("manifest.json"):
            try:
                with open(manifest_file, 'r', encoding='utf-8') as f:
                    manifest = json.load(f)
                
                tool_info = {
                    "name": manifest.get("name", manifest_file.parent.name),
                    "category": category,
                    "path": str(manifest_file.parent),
                    "description": manifest.get("description", ""),
                    "version": manifest.get("version", "1.0.0"),
                    "schema": manifest.get("schema", self._generate_default_schema(manifest)),
                    "mcp_compatible": True,
                    "manifest": manifest
                }
                
                tools.append(tool_info)
            except Exception as e:
                logger.error(f"Failed to parse manifest {manifest_file}: {e}")
        
        return tools
    
    def _generate_default_schema(self, manifest: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a default MCP tool schema from manifest."""
        return {
            "name": manifest.get("name", "unknown_tool"),
            "description": manifest.get("description", ""),
            "inputSchema": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    
    def get_all_tools(self) -> List[Dict[str, Any]]:
        """
        Get all tools as MCP-compliant tool definitions.
        Returns list of tools in MCP format for tools/list response.
        """
        # Refresh tool discovery
        self.discover_tools()
        
        mcp_tools = []
        
        for tool_id, tool_info in self.tool_cache.items():
            mcp_tool = {
                "name": tool_info.get("name", tool_id),
                "description": tool_info.get("description", ""),
                "inputSchema": tool_info.get("schema", {}).get("inputSchema", {
                    "type": "object",
                    "properties": {},
                    "required": []
                })
            }
            
            mcp_tools.append(mcp_tool)
        
        return mcp_tools
    
    def call_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a tool by name with given arguments.
        
        Args:
            tool_name: Name of the tool to execute
            arguments: Dictionary of arguments to pass to the tool
            
        Returns:
            Dictionary with execution result
        """
        # Find tool in cache
        tool_info = None
        for tool_id, info in self.tool_cache.items():
            if info.get("name") == tool_name:
                tool_info = info
                break
        
        if not tool_info:
            raise ValueError(f"Tool not found: {tool_name}")
        
        tool_path = Path(tool_info.get("path", ""))
        
        try:
            # Execute tool based on type
            if (tool_path / "index.js").exists():
                result = self._execute_node_tool(tool_path, arguments)
            elif (tool_path / "main.py").exists() or (tool_path / "tool.py").exists():
                result = self._execute_python_tool(tool_path, arguments)
            elif (tool_path / "main.go").exists():
                result = self._execute_go_tool(tool_path, arguments)
            else:
                # Try to execute via manifest command
                result = self._execute_via_manifest(tool_info, arguments)
            
            return {
                "status": "success",
                "tool": tool_name,
                "result": result
            }
            
        except Exception as e:
            logger.error(f"Tool execution failed for {tool_name}: {e}")
            raise
    
    def _execute_node_tool(self, tool_path: Path, arguments: Dict[str, Any]) -> Any:
        """Execute a Node.js based MCP tool."""
        import subprocess
        
        # Create MCP request
        request = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/call",
            "params": {
                "name": tool_path.name,
                "arguments": arguments
            }
        }
        
        # Execute via node
        result = subprocess.run(
            ["node", "index.js"],
            input=json.dumps(request),
            capture_output=True,
            text=True,
            cwd=str(tool_path),
            timeout=30
        )
        
        if result.returncode != 0:
            raise RuntimeError(f"Tool execution failed: {result.stderr}")
        
        response = json.loads(result.stdout)
        return response.get("result", {})
    
    def _execute_python_tool(self, tool_path: Path, arguments: Dict[str, Any]) -> Any:
        """Execute a Python based MCP tool."""
        import subprocess
        
        # Find main Python file
        main_file = tool_path / "main.py"
        if not main_file.exists():
            main_file = tool_path / "tool.py"
        
        # Execute Python script
        result = subprocess.run(
            ["python", str(main_file)],
            input=json.dumps(arguments),
            capture_output=True,
            text=True,
            cwd=str(tool_path),
            timeout=30
        )
        
        if result.returncode != 0:
            raise RuntimeError(f"Tool execution failed: {result.stderr}")
        
        try:
            return json.loads(result.stdout)
        except json.JSONDecodeError:
            return {"output": result.stdout}
    
    def _execute_go_tool(self, tool_path: Path, arguments: Dict[str, Any]) -> Any:
        """Execute a Go based MCP tool."""
        import subprocess
        
        # Build and run Go tool
        result = subprocess.run(
            ["go", "run", "."],
            input=json.dumps(arguments),
            capture_output=True,
            text=True,
            cwd=str(tool_path),
            timeout=30
        )
        
        if result.returncode != 0:
            raise RuntimeError(f"Tool execution failed: {result.stderr}")
        
        try:
            return json.loads(result.stdout)
        except json.JSONDecodeError:
            return {"output": result.stdout}
    
    def _execute_via_manifest(self, tool_info: Dict[str, Any], arguments: Dict[str, Any]) -> Any:
        """Execute tool using manifest-defined command."""
        manifest = tool_info.get("manifest", {})
        command = manifest.get("command")
        
        if not command:
            raise ValueError(f"No execution method found for tool {tool_info.get('name')}")
        
        import subprocess
        
        result = subprocess.run(
            command + [json.dumps(arguments)],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode != 0:
            raise RuntimeError(f"Tool execution failed: {result.stderr}")
        
        try:
            return json.loads(result.stdout)
        except json.JSONDecodeError:
            return {"output": result.stdout}
    
    def get_inventory_report(self) -> Dict[str, Any]:
        """Get a report of all tools in inventory."""
        return {
            "total_tools": len(self.tool_cache),
            "categories": self._count_by_category(),
            "tools": list(self.tool_cache.values())
        }
    
    def _count_by_category(self) -> Dict[str, int]:
        """Count tools by category."""
        counts = {}
        for tool_info in self.tool_cache.values():
            category = tool_info.get("category", "unknown")
            counts[category] = counts.get(category, 0) + 1
        return counts
