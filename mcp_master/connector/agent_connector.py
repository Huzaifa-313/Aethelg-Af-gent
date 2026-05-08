#!/usr/bin/env python3
"""
MCP Agent-Tool Connector
Connects agents to tools and manages tool access.
"""

import json
import os
from typing import Dict, List, Any, Optional
from datetime import datetime

class AgentConnector:
    def __init__(self, registry_path: str = "../registry/tool_registry.json"):
        self.registry_path = registry_path
        self.registry = self._load_registry()
        self.agents = {}
        self.agent_tools = {}

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

    def register_agent(self, agent_id: str, agent_name: str, allowed_categories: List[str] = None) -> Dict[str, Any]:
        """Register a new agent with the connector."""
        if agent_id in self.agents:
            return {"status": "error", "message": f"Agent {agent_id} already registered"}
        
        self.agents[agent_id] = {
            "id": agent_id,
            "name": agent_name,
            "allowed_categories": allowed_categories or [],
            "registered_at": datetime.now().isoformat(),
            "status": "active"
        }
        
        self.agent_tools[agent_id] = []
        
        return {
            "status": "success",
            "message": f"Agent {agent_name} registered successfully",
            "agent_id": agent_id
        }

    def unregister_agent(self, agent_id: str) -> Dict[str, Any]:
        """Unregister an agent from the connector."""
        if agent_id not in self.agents:
            return {"status": "error", "message": f"Agent {agent_id} not found"}
        
        del self.agents[agent_id]
        if agent_id in self.agent_tools:
            del self.agent_tools[agent_id]
        
        return {
            "status": "success",
            "message": f"Agent {agent_id} unregistered successfully"
        }

    def get_agent_tools(self, agent_id: str) -> List[str]:
        """Get the list of tools available to an agent."""
        if agent_id not in self.agents:
            return []
        
        agent = self.agents[agent_id]
        allowed_categories = agent.get("allowed_categories", [])
        
        available_tools = []
        for tool_name, tool_data in self.registry.get("tools", {}).items():
            category = tool_data.get("category", "")
            if not allowed_categories or category in allowed_categories:
                available_tools.append(tool_name)
        
        return available_tools

    def assign_tool_to_agent(self, agent_id: str, tool_name: str) -> Dict[str, Any]:
        """Assign a specific tool to an agent."""
        if agent_id not in self.agents:
            return {"status": "error", "message": f"Agent {agent_id} not found"}
        
        if tool_name not in self.registry.get("tools", {}):
            return {"status": "error", "message": f"Tool {tool_name} not found in registry"}
        
        if agent_id not in self.agent_tools:
            self.agent_tools[agent_id] = []
        
        if tool_name not in self.agent_tools[agent_id]:
            self.agent_tools[agent_id].append(tool_name)
            return {"status": "success", "message": f"Tool {tool_name} assigned to agent {agent_id}"}
        else:
            return {"status": "info", "message": f"Tool {tool_name} already assigned to agent {agent_id}"}

    def remove_tool_from_agent(self, agent_id: str, tool_name: str) -> Dict[str, Any]:
        """Remove a specific tool from an agent."""
        if agent_id not in self.agents:
            return {"status": "error", "message": f"Agent {agent_id} not found"}
        
        if agent_id in self.agent_tools and tool_name in self.agent_tools[agent_id]:
            self.agent_tools[agent_id].remove(tool_name)
            return {"status": "success", "message": f"Tool {tool_name} removed from agent {agent_id}"}
        else:
            return {"status": "error", "message": f"Tool {tool_name} not assigned to agent {agent_id}"}

    def get_agent_status(self, agent_id: str) -> Dict[str, Any]:
        """Get the status of an agent."""
        if agent_id not in self.agents:
            return {"status": "error", "message": f"Agent {agent_id} not found"}
        
        agent = self.agents[agent_id]
        tools = self.agent_tools.get(agent_id, [])
        
        return {
            "status": "success",
            "agent": agent,
            "assigned_tools": tools,
            "available_tools": self.get_agent_tools(agent_id)
        }

    def list_agents(self) -> List[Dict[str, Any]]:
        """List all registered agents."""
        return [
            {
                "id": agent_id,
                "name": agent["name"],
                "status": agent["status"],
                "registered_at": agent["registered_at"]
            }
            for agent_id, agent in self.agents.items()
        ]

if __name__ == "__main__":
    connector = AgentConnector()
    
    # Example usage
    result = connector.register_agent("agent_001", "WebScraper", ["web_tools", "file_tools"])
    print(f"Registration: {result}")
    
    result = connector.assign_tool_to_agent("agent_001", "fetch")
    print(f"Tool Assignment: {result}")
    
    result = connector.assign_tool_to_agent("agent_001", "filesystem")
    print(f"Tool Assignment: {result}")
    
    status = connector.get_agent_status("agent_001")
    print(f"Agent Status: {status}")
    
    agents = connector.list_agents()
    print(f"Registered Agents: {agents}")