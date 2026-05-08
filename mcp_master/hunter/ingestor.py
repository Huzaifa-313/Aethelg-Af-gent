# Mahoraga MCP Server - Tool Ingestor
# Handles integration of discovered MCP tools

import os
import shutil
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, Optional

class ToolIngestor:
    """Ingests and integrates discovered MCP tools."""
    
    def __init__(self,
                 mcp_root: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\mcp_master",
                 staging_dir: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\mcp_master\\_mahoraga_sys\\staging",
                 ingested_dir: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\mcp_master\\tools\\ingested"):
        self.mcp_root = Path(mcp_root)
        self.staging_dir = Path(staging_dir)
        self.ingested_dir = Path(ingested_dir)
        
        # Ensure directories exist
        self.staging_dir.mkdir(parents=True, exist_ok=True)
        self.ingested_dir.mkdir(parents=True, exist_ok=True)
        
        self.inventory_file = self.mcp_root / "_mahoraga_sys" / "tool_inventory.json"
    
    def ingest_repository(self, repo_path: str, analysis: Dict) -> bool:
        """Ingest a repository as an MCP tool."""
        source_path = Path(repo_path)
        
        if not source_path.exists():
            return False
        
        # Check MCP compatibility
        if not analysis.get("is_mcp_compatible"):
            print(f"Repository {source_path.name} is not MCP-compatible")
            return False
        
        # Create tool directory
        tool_name = source_path.name
        tool_dir = self.ingested_dir / tool_name
        
        if tool_dir.exists():
            print(f"Tool {tool_name} already exists")
            return False
        
        try:
            # Copy to ingested directory
            shutil.copytree(source_path, tool_dir)
            
            # Add metadata
            self._add_tool_metadata(tool_dir, analysis)
            
            # Update inventory
            self._update_inventory(tool_name, tool_dir, analysis)
            
            print(f"Ingested tool: {tool_name}")
            return True
            
        except Exception as e:
            print(f"Failed to ingest {tool_name}: {e}")
            if tool_dir.exists():
                shutil.rmtree(tool_dir)
            return False
    
    def _add_tool_metadata(self, tool_dir: Path, analysis: Dict):
        """Add metadata file to ingested tool."""
        metadata = {
            "name": tool_dir.name,
            "ingested_at": datetime.now().isoformat(),
            "source": str(tool_dir),
            "is_mcp_compatible": analysis.get("is_mcp_compatible"),
            "tool_count": analysis.get("tool_count", 0),
            "capabilities": analysis.get("capabilities", []),
            "mcp_files": analysis.get("mcp_files", []),
            "has_manifest": analysis.get("has_manifest", False),
            "has_tool_schema": analysis.get("has_tool_schema", False)
        }
        
        metadata_file = tool_dir / "mahoraga_metadata.json"
        with open(metadata_file, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2)
    
    def _update_inventory(self, tool_name: str, tool_dir: Path, analysis: Dict):
        """Update tool inventory with new tool."""
        try:
            with open(self.inventory_file, 'r', encoding='utf-8') as f:
                inventory = json.load(f)
            
            # Add tool entry
            tool_entry = {
                "name": tool_name,
                "path": str(tool_dir.relative_to(self.mcp_root)),
                "ingested_at": datetime.now().isoformat(),
                "is_mcp_compatible": analysis.get("is_mcp_compatible"),
                "tool_count": analysis.get("tool_count", 0),
                "status": "active"
            }
            
            inventory['tools'].append(tool_entry)
            inventory['total_tools'] = len(inventory['tools'])
            inventory['last_updated'] = datetime.now().isoformat()
            
            with open(self.inventory_file, 'w', encoding='utf-8') as f:
                json.dump(inventory, f, indent=2)
                
        except Exception as e:
            print(f"Failed to update inventory: {e}")
    
    def list_ingested_tools(self) -> list:
        """List all ingested tools."""
        tools = []
        
        if not self.ingested_dir.exists():
            return tools
        
        for tool_dir in self.ingested_dir.iterdir():
            if tool_dir.is_dir():
                metadata_file = tool_dir / "mahoraga_metadata.json"
                if metadata_file.exists():
                    try:
                        with open(metadata_file, 'r', encoding='utf-8') as f:
                            metadata = json.load(f)
                            tools.append(metadata)
                    except:
                        pass
        
        return tools
