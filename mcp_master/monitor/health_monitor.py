#!/usr/bin/env python3
"""
MCP Continuous Health Monitor
Continuously monitors the health of the MCP system and its components.
"""

import json
import os
import time
import threading
from typing import Dict, List, Any, Optional
from datetime import datetime

class HealthMonitor:
    def __init__(self, registry_path: str = "../registry/tool_registry.json", check_interval: int = 60):
        self.registry_path = registry_path
        self.check_interval = check_interval
        self.registry = self._load_registry()
        self.health_status = {}
        self.monitoring = False
        self.monitor_thread = None

    def _load_registry(self) -> Dict:
        """Load the tool registry from JSON."""
        try:
            with open(self.registry_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Error: Registry file not found at {self.registry_path}")
            return {}
        except json.JSONDecodeError:
            print(f"Error: Invalid JSON in registry file {self.registry_path}")
            return {}

    def start_monitoring(self):
        """Start continuous health monitoring."""
        if self.monitoring:
            print("Health monitoring is already running")
            return
        
        print("Starting health monitoring...")
        self.monitoring = True
        self.monitor_thread = threading.Thread(target=self._monitor_loop)
        self.monitor_thread.daemon = True
        self.monitor_thread.start()

    def stop_monitoring(self):
        """Stop continuous health monitoring."""
        if not self.monitoring:
            print("Health monitoring is not running")
            return
        
        print("Stopping health monitoring...")
        self.monitoring = False
        if self.monitor_thread:
            self.monitor_thread.join()

    def _monitor_loop(self):
        """Main monitoring loop."""
        while self.monitoring:
            self._check_health()
            time.sleep(self.check_interval)

    def _check_health(self):
        """Check the health of all tools and components."""
        for tool_name, tool_data in self.registry.get("tools", {}).items():
            health = self._check_tool_health(tool_name, tool_data)
            self.health_status[tool_name] = health
            
            # Update registry with health status
            if tool_name in self.registry.get("tools", {}):
                self.registry["tools"][tool_name]["performance"]["health"] = health["status"]

    def _check_tool_health(self, tool_name: str, tool_data: Dict) -> Dict[str, Any]:
        """Check the health of a specific tool."""
        try:
            # In a real implementation, this would check if the tool is responding
            # For now, we'll simulate a health check
            
            performance = tool_data.get("performance", {})
            success_rate = performance.get("success_rate", 1.0)
            usage_count = performance.get("usage_count", 0)
            
            # Determine health status based on success rate
            if success_rate >= 0.95:
                status = "healthy"
            elif success_rate >= 0.80:
                status = "degraded"
            else:
                status = "unhealthy"
            
            return {
                "tool": tool_name,
                "status": status,
                "success_rate": success_rate,
                "usage_count": usage_count,
                "last_checked": datetime.now().isoformat()
            }
        except Exception as e:
            return {
                "tool": tool_name,
                "status": "error",
                "error": str(e),
                "last_checked": datetime.now().isoformat()
            }

    def get_health_status(self, tool_name: str = None) -> Dict[str, Any]:
        """Get the health status of a specific tool or all tools."""
        if tool_name:
            return self.health_status.get(tool_name, {
                "tool": tool_name,
                "status": "unknown",
                "last_checked": datetime.now().isoformat()
            })
        
        return self.health_status

    def get_unhealthy_tools(self) -> List[str]:
        """Get a list of unhealthy tools."""
        return [
            tool_name for tool_name, health in self.health_status.items()
            if health.get("status") in ["unhealthy", "error"]
        ]

    def get_healthy_tools(self) -> List[str]:
        """Get a list of healthy tools."""
        return [
            tool_name for tool_name, health in self.health_status.items()
            if health.get("status") == "healthy"
        ]

    def get_degraded_tools(self) -> List[str]:
        """Get a list of degraded tools."""
        return [
            tool_name for tool_name, health in self.health_status.items()
            if health.get("status") == "degraded"
        ]

if __name__ == "__main__":
    monitor = HealthMonitor()
    
    # Example usage
    monitor.start_monitoring()
    
    try:
        while True:
            time.sleep(10)
            
            # Print health status
            health = monitor.get_health_status()
            print(f"Health Status: {json.dumps(health, indent=2)}")
            
            # Print unhealthy tools
            unhealthy = monitor.get_unhealthy_tools()
            if unhealthy:
                print(f"Unhealthy Tools: {unhealthy}")
            
            # Print degraded tools
            degraded = monitor.get_degraded_tools()
            if degraded:
                print(f"Degraded Tools: {degraded}")
    
    except KeyboardInterrupt:
        monitor.stop_monitoring()
        print("Health monitoring stopped")