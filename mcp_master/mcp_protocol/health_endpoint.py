"""
HealthEndpoint - Provides health/status information for Mahoraga server.
Lists tools, recent adaptations, active alerts, and system status.
"""

import json
import logging
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional

sys.path.insert(0, str(Path(__file__).parent.parent))

logger = logging.getLogger(__name__)


class HealthEndpoint:
    """
    Health and status endpoint for Mahoraga.
    
    Provides:
    - Server health status
    - List of available tools
    - Recent self-healing adaptations
    - Active security alerts
    - System metrics
    """
    
    def __init__(self):
        """Initialize the health endpoint."""
        self.mcp_master_path = Path(__file__).parent.parent
        self._mahoraga_sys_path = self.mcp_master_path / "_mahoraga_sys"
        
        # Paths to tracking files
        self.inventory_path = self._mahoraga_sys_path / "tool_inventory.json"
        self.adaptation_log_path = self._mahoraga_sys_path / "adaptation_log.yaml"
        self.quarantine_log_path = self._mahoraga_sys_path / "quarantine_log.txt"
        
        logger.info("HealthEndpoint initialized")
    
    def get_health_status(self) -> Dict[str, Any]:
        """
        Get comprehensive health status of Mahoraga server.
        
        Returns:
            Dictionary containing health status, tools, adaptations, alerts
        """
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "server": self._get_server_info(),
            "tools": self._get_tools_summary(),
            "adaptations": self._get_recent_adaptations(),
            "alerts": self._get_active_alerts(),
            "security": self._get_security_status(),
            "metrics": self._get_system_metrics()
        }
    
    def _get_server_info(self) -> Dict[str, Any]:
        """Get server information."""
        return {
            "name": "Mahoraga",
            "version": "1.0.0",
            "description": "Autonomous Self-Healing MCP Server",
            "uptime": self._get_uptime(),
            "mcp_compliant": True
        }
    
    def _get_uptime(self) -> str:
        """Get server uptime (placeholder)."""
        # In a real implementation, track start time
        return "N/A"
    
    def _get_tools_summary(self) -> Dict[str, Any]:
        """Get summary of available tools."""
        try:
            if self.inventory_path.exists():
                with open(self.inventory_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    tools = data.get("tools", {})
                    
                    # Count by category
                    categories = {}
                    for tool_id, tool_info in tools.items():
                        category = tool_info.get("category", "unknown")
                        categories[category] = categories.get(category, 0) + 1
                    
                    return {
                        "total": len(tools),
                        "categories": categories,
                        "mcp_compatible": sum(
                            1 for t in tools.values() 
                            if t.get("mcp_compatible", False)
                        )
                    }
        except Exception as e:
            logger.error(f"Failed to read inventory: {e}")
        
        return {"total": 0, "categories": {}, "mcp_compatible": 0}
    
    def _get_recent_adaptations(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent self-healing adaptations."""
        adaptations = []
        
        try:
            if self.adaptation_log_path.exists():
                with open(self.adaptation_log_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Parse YAML log (simplified parsing)
                    entries = content.split("---")
                    for entry in entries[-limit:]:  # Get last N entries
                        if entry.strip():
                            adaptations.append({
                                "raw": entry.strip()[:200]  # Truncate
                            })
        except Exception as e:
            logger.error(f"Failed to read adaptation log: {e}")
        
        return adaptations
    
    def _get_active_alerts(self) -> List[Dict[str, Any]]:
        """Get active security and system alerts."""
        alerts = []
        
        try:
            if self.quarantine_log_path.exists():
                with open(self.quarantine_log_path, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    
                    # Get recent quarantine events (last 24 hours)
                    recent_time = datetime.utcnow() - timedelta(hours=24)
                    
                    for line in lines[-50:]:  # Check last 50 lines
                        if "QUARANTINED" in line or "THREAT" in line:
                            alerts.append({
                                "type": "security",
                                "severity": "high",
                                "message": line.strip()[:200]
                            })
        except Exception as e:
            logger.error(f"Failed to read quarantine log: {e}")
        
        return alerts
    
    def _get_security_status(self) -> Dict[str, Any]:
        """Get security scanning status."""
        quarantine_count = 0
        
        try:
            if self.quarantine_log_path.exists():
                with open(self.quarantine_log_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    quarantine_count = content.count("QUARANTINED")
        except Exception as e:
            logger.error(f"Failed to get security status: {e}")
        
        return {
            "scanner_active": True,
            "threats_quarantined": quarantine_count,
            "last_scan": self._get_last_scan_time()
        }
    
    def _get_last_scan_time(self) -> Optional[str]:
        """Get timestamp of last security scan."""
        try:
            if self.quarantine_log_path.exists():
                mtime = os.path.getmtime(self.quarantine_log_path)
                return datetime.fromtimestamp(mtime).isoformat()
        except Exception:
            pass
        return None
    
    def _get_system_metrics(self) -> Dict[str, Any]:
        """Get system performance metrics."""
        return {
            "tools_discovered": self._count_tools(),
            "hunts_performed": self._count_hunts(),
            "healings_performed": self._count_healings(),
            "files_quarantined": self._count_quarantined()
        }
    
    def _count_tools(self) -> int:
        """Count total tools in inventory."""
        try:
            if self.inventory_path.exists():
                with open(self.inventory_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    return len(data.get("tools", {}))
        except Exception:
            pass
        return 0
    
    def _count_hunts(self) -> int:
        """Count number of GitHub hunts performed."""
        # Placeholder - would track in a separate log
        return 0
    
    def _count_healings(self) -> int:
        """Count number of self-healing operations."""
        try:
            if self.adaptation_log_path.exists():
                with open(self.adaptation_log_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    return content.count("adaptation:")
        except Exception:
            pass
        return 0
    
    def _count_quarantined(self) -> int:
        """Count number of quarantined files."""
        try:
            if self.quarantine_log_path.exists():
                with open(self.quarantine_log_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    return content.count("QUARANTINED")
        except Exception:
            pass
        return 0
    
    def get_tools_list(self) -> List[Dict[str, Any]]:
        """Get detailed list of all tools."""
        tools = []
        
        try:
            if self.inventory_path.exists():
                with open(self.inventory_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    for tool_id, tool_info in data.get("tools", {}).items():
                        tools.append({
                            "id": tool_id,
                            "name": tool_info.get("name", tool_id),
                            "category": tool_info.get("category", "unknown"),
                            "mcp_compatible": tool_info.get("mcp_compatible", False),
                            "description": tool_info.get("description", "")
                        })
        except Exception as e:
            logger.error(f"Failed to get tools list: {e}")
        
        return tools
    
    def get_adaptation_log(self) -> str:
        """Get full adaptation log content."""
        try:
            if self.adaptation_log_path.exists():
                with open(self.adaptation_log_path, 'r', encoding='utf-8') as f:
                    return f.read()
        except Exception as e:
            logger.error(f"Failed to read adaptation log: {e}")
        
        return "No adaptation log available"
