#!/usr/bin/env python3
"""
MCP Intelligent Tool Router
Analyzes task context and selects the most relevant tools (max 10).
"""

import json
import os
from typing import Dict, List, Any

class ToolRouter:
    def __init__(self, registry_path: str = "../registry/tool_registry.json"):
        self.registry_path = registry_path
        self.registry = self._load_registry()
        self.max_tools = 10

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

    def analyze_task(self, task: str) -> List[str]:
        """Analyze task context and return relevant tool names."""
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

        # Sort tools by score and return top N
        sorted_tools = sorted(tool_scores.items(), key=lambda x: x[1], reverse=True)
        return [tool[0] for tool in sorted_tools[:self.max_tools]]

    def get_tool_details(self, tool_name: str) -> Dict[str, Any]:
        """Get detailed information about a specific tool."""
        return self.registry.get("tools", {}).get(tool_name, {})

    def route_task(self, task: str) -> Dict[str, Any]:
        """Route a task to the most relevant tools."""
        relevant_tools = self.analyze_task(task)
        tool_details = {}

        for tool in relevant_tools:
            details = self.get_tool_details(tool)
            if details:
                tool_details[tool] = {
                    "name": details.get("name"),
                    "description": details.get("description"),
                    "category": details.get("category"),
                    "tools": details.get("tools", []),
                    "performance": details.get("performance", {})
                }

        return {
            "task": task,
            "selected_tools": relevant_tools,
            "tool_details": tool_details,
            "total_tools": len(relevant_tools)
        }

if __name__ == "__main__":
    router = ToolRouter()
    
    # Example usage
    task = "I need to search for files and then fetch some web content"
    result = router.route_task(task)
    
    print(f"Task: {result['task']}")
    print(f"Selected Tools ({result['total_tools']}):")
    for tool in result['selected_tools']:
        print(f"  - {tool}")
    
    print("\nTool Details:")
    for tool_name, details in result['tool_details'].items():
        print(f"  {tool_name}:")
        print(f"    Description: {details['description']}")
        print(f"    Category: {details['category']}")
        print(f"    Available Tools: {[t['name'] for t in details['tools']]}")
        print()