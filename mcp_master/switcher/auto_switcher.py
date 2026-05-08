#!/usr/bin/env python3
"""
MCP Auto Switching Engine
Automatically switches tools based on task context and demand.
"""

import json
import os
from typing import Dict, List, Any, Optional
from datetime import datetime
import time

class AutoSwitcher:
    def __init__(self, registry_path: str = "../registry/tool_registry.json"):
        self.registry_path = registry_path
        self.registry = self._load_registry()
        self.active_tools = set()
        self.min_active_tools = 30
        self.max_active_tools = 50
        self.demand_threshold = 3
        self.adjustment_interval = 10
        self.last_adjustment = time.time()

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

    def analyze_demand(self, task: str) -> Dict[str, int]:
        """Analyze task demand and return tool scores."""
        task_lower = task.lower()
        tool_scores = {}

        for tool_name, tool_data in self.registry.get("tools", {}).items():
            score = 0
            keywords = tool_data.get("keywords", [])
            category = tool_data.get("category", "")
            description = tool_data.get("description", "").lower()

            # Check for keyword matches
            for keyword in keywords:
                if keyword.lower() in task_lower:
                    score += 1

            # Check for category match
            if category.lower() in task_lower:
                score += 2

            # Check for description match
            if any(word in description for word in task_lower.split()):
                score += 1

            # Prioritize core tools
            if tool_data.get("core_tool", False):
                score += 3

            if score > 0:
                tool_scores[tool_name] = score

        return tool_scores

    def switch_tools(self, task: str) -> Dict[str, Any]:
        """Switch tools based on task context and demand."""
        tool_scores = self.analyze_demand(task)
        
        # Sort tools by score
        sorted_tools = sorted(tool_scores.items(), key=lambda x: x[1], reverse=True)
        
        # Determine number of tools to activate based on demand
        total_demand = sum(tool_scores.values())
        num_tools = min(max(self.min_active_tools, total_demand // self.demand_threshold), self.max_active_tools)
        
        # Select top N tools
        selected_tools = [tool[0] for tool in sorted_tools[:num_tools]]
        
        # Update active tools
        self.active_tools = set(selected_tools)
        
        # Update performance metrics
        for tool_name in selected_tools:
            if tool_name in self.registry.get("tools", {}):
                self.registry["tools"][tool_name]["performance"]["usage_count"] += 1
                self.registry["tools"][tool_name]["performance"]["last_used"] = datetime.now().isoformat()
        
        return {
            "task": task,
            "selected_tools": selected_tools,
            "total_active": len(selected_tools),
            "demand_score": total_demand
        }

    def get_active_tools(self) -> List[str]:
        """Get the list of currently active tools."""
        return list(self.active_tools)

    def is_tool_active(self, tool_name: str) -> bool:
        """Check if a tool is currently active."""
        return tool_name in self.active_tools

    def adjust_scaling(self, min_active: int = None, max_active: int = None, demand_threshold: int = None):
        """Adjust the scaling parameters."""
        if min_active is not None:
            self.min_active_tools = min_active
        if max_active is not None:
            self.max_active_tools = max_active
        if demand_threshold is not None:
            self.demand_threshold = demand_threshold
        
        return {
            "min_active_tools": self.min_active_tools,
            "max_active_tools": self.max_active_tools,
            "demand_threshold": self.demand_threshold
        }

    def get_scaling_status(self) -> Dict[str, Any]:
        """Get the current scaling status."""
        return {
            "min_active_tools": self.min_active_tools,
            "max_active_tools": self.max_active_tools,
            "demand_threshold": self.demand_threshold,
            "current_active": len(self.active_tools),
            "active_tools": list(self.active_tools)
        }

if __name__ == "__main__":
    switcher = AutoSwitcher()
    
    # Example usage
    task = "I need to search for files and then fetch some web content"
    result = switcher.switch_tools(task)
    
    print(f"Task: {result['task']}")
    print(f"Selected Tools ({result['total_active']}):")
    for tool in result['selected_tools']:
        print(f"  - {tool}")
    
    print(f"\nDemand Score: {result['demand_score']}")
    
    status = switcher.get_scaling_status()
    print(f"\nScaling Status: {status}")