#!/usr/bin/env python3
"""
MCP Master Launcher
Launches the MCP system and manages all components.
"""

import os
import sys
import json
import subprocess
from typing import Dict, List, Any, Optional
from datetime import datetime

class MasterLauncher:
    def __init__(self, config_path: str = "../config/mcp_config.json"):
        self.config_path = config_path
        self.config = self._load_config()
        self.components = {}
        self.status = "stopped"

    def _load_config(self) -> Dict:
        """Load the MCP configuration from JSON."""
        try:
            with open(self.config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Warning: Config file not found at {self.config_path}, using defaults")
            return self._default_config()
        except json.JSONDecodeError:
            print(f"Error: Invalid JSON in config file {self.config_path}")
            return self._default_config()

    def _default_config(self) -> Dict:
        """Return default configuration."""
        return {
            "registry_path": "../registry/tool_registry.json",
            "router_path": "../router/tool_router.py",
            "connector_path": "../connector/agent_connector.py",
            "switcher_path": "../switcher/auto_switcher.py",
            "compatibility_path": "../compatibility/compatibility_layer.py",
            "monitor_path": "../monitor/health_monitor.py",
            "log_level": "INFO",
            "max_tools": 10,
            "auto_switch": True
        }

    def start(self) -> Dict[str, Any]:
        """Start the MCP system."""
        if self.status == "running":
            return {"status": "error", "message": "MCP system is already running"}
        
        print("Starting MCP system...")
        self.status = "starting"
        
        # Start components
        self._start_registry()
        self._start_router()
        self._start_connector()
        self._start_switcher()
        self._start_compatibility()
        self._start_monitor()
        
        self.status = "running"
        print("MCP system started successfully")
        
        return {
            "status": "success",
            "message": "MCP system started successfully",
            "components": list(self.components.keys()),
            "started_at": datetime.now().isoformat()
        }

    def stop(self) -> Dict[str, Any]:
        """Stop the MCP system."""
        if self.status == "stopped":
            return {"status": "error", "message": "MCP system is already stopped"}
        
        print("Stopping MCP system...")
        self.status = "stopping"
        
        # Stop components
        for component_name in list(self.components.keys()):
            self._stop_component(component_name)
        
        self.status = "stopped"
        print("MCP system stopped successfully")
        
        return {
            "status": "success",
            "message": "MCP system stopped successfully",
            "stopped_at": datetime.now().isoformat()
        }

    def restart(self) -> Dict[str, Any]:
        """Restart the MCP system."""
        self.stop()
        return self.start()

    def _start_component(self, name: str, path: str) -> bool:
        """Start a specific component."""
        try:
            print(f"Starting {name}...")
            # In a real implementation, this would start the component as a separate process
            self.components[name] = {
                "path": path,
                "status": "running",
                "started_at": datetime.now().isoformat()
            }
            return True
        except Exception as e:
            print(f"Error starting {name}: {e}")
            return False

    def _stop_component(self, name: str) -> bool:
        """Stop a specific component."""
        try:
            print(f"Stopping {name}...")
            if name in self.components:
                self.components[name]["status"] = "stopped"
                self.components[name]["stopped_at"] = datetime.now().isoformat()
            return True
        except Exception as e:
            print(f"Error stopping {name}: {e}")
            return False

    def _start_registry(self):
        """Start the tool registry."""
        self._start_component("registry", self.config.get("registry_path"))

    def _start_router(self):
        """Start the tool router."""
        self._start_component("router", self.config.get("router_path"))

    def _start_connector(self):
        """Start the agent connector."""
        self._start_component("connector", self.config.get("connector_path"))

    def _start_switcher(self):
        """Start the auto switcher."""
        self._start_component("switcher", self.config.get("switcher_path"))

    def _start_compatibility(self):
        """Start the compatibility layer."""
        self._start_component("compatibility", self.config.get("compatibility_path"))

    def _start_monitor(self):
        """Start the health monitor."""
        self._start_component("monitor", self.config.get("monitor_path"))

    def get_status(self) -> Dict[str, Any]:
        """Get the current status of the MCP system."""
        return {
            "status": self.status,
            "components": self.components,
            "config": self.config
        }

if __name__ == "__main__":
    launcher = MasterLauncher()
    
    # Example usage
    result = launcher.start()
    print(f"Start Result: {result}")
    
    status = launcher.get_status()
    print(f"System Status: {status}")
    
    # Keep running until interrupted
    try:
        while True:
            pass
    except KeyboardInterrupt:
        result = launcher.stop()
        print(f"Stop Result: {result}")