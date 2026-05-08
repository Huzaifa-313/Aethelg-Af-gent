#!/usr/bin/env python3
"""
MCP Universal Compatibility Layer
Provides compatibility for all systems (LiteLLM, OpenManus, Claude Coordinator, future agents).
"""

import json
import os
from typing import Dict, List, Any, Optional
from datetime import datetime

class CompatibilityLayer:
    def __init__(self, registry_path: str = "../registry/tool_registry.json"):
        self.registry_path = registry_path
        self.registry = self._load_registry()
        self.systems = {}
        self.adapters = {}

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

    def register_system(self, system_name: str, system_type: str, config: Dict[str, Any] = None) -> Dict[str, Any]:
        """Register a new system with the compatibility layer."""
        if system_name in self.systems:
            return {"status": "error", "message": f"System {system_name} already registered"}
        
        self.systems[system_name] = {
            "name": system_name,
            "type": system_type,
            "config": config or {},
            "registered_at": datetime.now().isoformat(),
            "status": "active"
        }
        
        return {
            "status": "success",
            "message": f"System {system_name} registered successfully",
            "system": self.systems[system_name]
        }

    def unregister_system(self, system_name: str) -> Dict[str, Any]:
        """Unregister a system from the compatibility layer."""
        if system_name not in self.systems:
            return {"status": "error", "message": f"System {system_name} not found"}
        
        del self.systems[system_name]
        if system_name in self.adapters:
            del self.adapters[system_name]
        
        return {
            "status": "success",
            "message": f"System {system_name} unregistered successfully"
        }

    def create_adapter(self, system_name: str, adapter_type: str) -> Dict[str, Any]:
        """Create an adapter for a specific system."""
        if system_name not in self.systems:
            return {"status": "error", "message": f"System {system_name} not found"}
        
        adapter = {
            "system": system_name,
            "type": adapter_type,
            "created_at": datetime.now().isoformat(),
            "status": "active"
        }
        
        self.adapters[system_name] = adapter
        
        return {
            "status": "success",
            "message": f"Adapter for {system_name} created successfully",
            "adapter": adapter
        }

    def get_system_tools(self, system_name: str) -> List[str]:
        """Get the list of tools available for a specific system."""
        if system_name not in self.systems:
            return []
        
        system = self.systems[system_name]
        system_type = system.get("type", "")
        
        available_tools = []
        for tool_name, tool_data in self.registry.get("tools", {}).items():
            # Filter tools based on system type
            if system_type == "llm" and tool_data.get("category") in ["web_tools", "file_tools"]:
                available_tools.append(tool_name)
            elif system_type == "agent" and tool_data.get("category") in ["agent_tools", "mcp_tools"]:
                available_tools.append(tool_name)
            elif system_type == "coordinator" and tool_data.get("core_tool", False):
                available_tools.append(tool_name)
            else:
                available_tools.append(tool_name)
        
        return available_tools

    def translate_request(self, system_name: str, request: Dict[str, Any]) -> Dict[str, Any]:
        """Translate a request from a specific system to MCP format."""
        if system_name not in self.systems:
            return {"status": "error", "message": f"System {system_name} not found"}
        
        system = self.systems[system_name]
        system_type = system.get("type", "")
        
        # Translate request based on system type
        if system_type == "llm":
            return self._translate_llm_request(request)
        elif system_type == "agent":
            return self._translate_agent_request(request)
        elif system_type == "coordinator":
            return self._translate_coordinator_request(request)
        else:
            return self._translate_generic_request(request)

    def _translate_llm_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Translate a request from an LLM system."""
        return {
            "system": "llm",
            "task": request.get("prompt", ""),
            "tools": request.get("tools", []),
            "parameters": request.get("parameters", {})
        }

    def _translate_agent_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Translate a request from an agent system."""
        return {
            "system": "agent",
            "task": request.get("task", ""),
            "agent_id": request.get("agent_id", ""),
            "tools": request.get("tools", []),
            "parameters": request.get("parameters", {})
        }

    def _translate_coordinator_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Translate a request from a coordinator system."""
        return {
            "system": "coordinator",
            "task": request.get("task", ""),
            "agents": request.get("agents", []),
            "tools": request.get("tools", []),
            "parameters": request.get("parameters", {})
        }

    def _translate_generic_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Translate a generic request."""
        return {
            "system": "generic",
            "task": request.get("task", ""),
            "tools": request.get("tools", []),
            "parameters": request.get("parameters", {})
        }

    def get_system_status(self, system_name: str) -> Dict[str, Any]:
        """Get the status of a specific system."""
        if system_name not in self.systems:
            return {"status": "error", "message": f"System {system_name} not found"}
        
        system = self.systems[system_name]
        adapter = self.adapters.get(system_name, {})
        
        return {
            "status": "success",
            "system": system,
            "adapter": adapter,
            "available_tools": self.get_system_tools(system_name)
        }

    def list_systems(self) -> List[Dict[str, Any]]:
        """List all registered systems."""
        return [
            {
                "name": system_name,
                "type": system["type"],
                "status": system["status"],
                "registered_at": system["registered_at"]
            }
            for system_name, system in self.systems.items()
        ]

if __name__ == "__main__":
    compatibility = CompatibilityLayer()
    
    # Example usage
    result = compatibility.register_system("LiteLLM", "llm", {"api_key": "test_key"})
    print(f"System Registration: {result}")
    
    result = compatibility.register_system("OpenManus", "agent", {"agent_id": "agent_001"})
    print(f"System Registration: {result}")
    
    result = compatibility.register_system("ClaudeCoordinator", "coordinator", {"coordinator_id": "coord_001"})
    print(f"System Registration: {result}")
    
    result = compatibility.create_adapter("LiteLLM", "llm_adapter")
    print(f"Adapter Creation: {result}")
    
    tools = compatibility.get_system_tools("LiteLLM")
    print(f"Available Tools for LiteLLM: {tools}")
    
    request = {
        "prompt": "Search for files and fetch web content",
        "tools": ["everything", "fetch"],
        "parameters": {"limit": 10}
    }
    translated = compatibility.translate_request("LiteLLM", request)
    print(f"Translated Request: {translated}")
    
    systems = compatibility.list_systems()
    print(f"Registered Systems: {systems}")