# Mahoraga MCP Server - Rollback Manager
# Handles tool rollback to last known good state

import os
import shutil
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict

class RollbackManager:
    """Manages rollback to last known good snapshot."""
    
    def __init__(self,
                 mcp_root: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\mcp_master",
                 snapshot_dir: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\mcp_master\\_mahoraga_sys\\snapshot_initial",
                 quarantine_dir: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\mcp_master\\_mahoraga_sys\\quarantine_critical"):
        self.mcp_root = Path(mcp_root)
        self.snapshot_dir = Path(snapshot_dir)
        self.quarantine_dir = Path(quarantine_dir)
        self.quarantine_dir.mkdir(parents=True, exist_ok=True)
        
    def rollback_tool(self, tool_name: str, tool_path: Optional[str] = None) -> Dict:
        """Rollback a tool to its last known good state."""
        if not tool_path:
            tool_path = str(self.mcp_root / "tools" / "ingested" / tool_name)
        
        tool_path = Path(tool_path)
        
        # Find snapshot
        snapshot_path = self.snapshot_dir / tool_path.relative_to(self.mcp_root)
        
        if not snapshot_path.exists():
            return {
                "success": False,
                "action": "rollback_failed",
                "details": f"No snapshot found for {tool_name}"
            }
        
        try:
            # Quarantine current version
            if tool_path.exists():
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                quarantine_path = self.quarantine_dir / f"{tool_name}_{timestamp}"
                
                shutil.move(str(tool_path), str(quarantine_path))
            
            # Restore from snapshot
            shutil.copytree(snapshot_path, tool_path)
            
            return {
                "success": True,
                "action": "rollback",
                "details": f"Rolled back {tool_name} to snapshot"
            }
            
        except Exception as e:
            return {
                "success": False,
                "action": "rollback_failed",
                "details": f"Rollback failed: {e}"
            }
    
    def create_snapshot(self, tool_path: str) -> bool:
        """Create a snapshot of a tool's current state."""
        source = Path(tool_path)
        
        if not source.exists():
            return False
        
        try:
            # Determine snapshot path
            rel_path = source.relative_to(self.mcp_root)
            snapshot_path = self.snapshot_dir / rel_path
            
            # Create parent directories
            snapshot_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Copy to snapshot
            if source.is_file():
                shutil.copy2(source, snapshot_path)
            else:
                shutil.copytree(source, snapshot_path)
            
            return True
            
        except Exception as e:
            print(f"Failed to create snapshot: {e}")
            return False
    
    def list_snapshots(self) -> list:
        """List all available snapshots."""
        snapshots = []
        
        for item in self.snapshot_dir.rglob("*"):
            if item.is_file():
                snapshots.append({
                    "path": str(item),
                    "relative_path": str(item.relative_to(self.snapshot_dir)),
                    "size": item.stat().st_size,
                    "modified": datetime.fromtimestamp(item.stat().st_mtime).isoformat()
                })
        
        return snapshots
    
    def restore_from_snapshot(self, snapshot_path: str, restore_path: str) -> bool:
        """Restore a specific file from snapshot."""
        source = Path(snapshot_path)
        dest = Path(restore_path)
        
        if not source.exists():
            return False
        
        try:
            dest.parent.mkdir(parents=True, exist_ok=True)
            
            if source.is_file():
                shutil.copy2(source, dest)
            else:
                if dest.exists():
                    shutil.rmtree(dest)
                shutil.copytree(source, dest)
            
            return True
            
        except Exception as e:
            print(f"Restore failed: {e}")
            return False
