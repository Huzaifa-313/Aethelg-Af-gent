#!/usr/bin/env python3
"""
Multi-Agent Coordinator
Integrates OpenManus multi-agent architecture into mcp_master.
Provides task planning, execution, and tool management across multiple agents.
"""

from __future__ import annotations

import json
import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Base Types
# ---------------------------------------------------------------------------

@dataclass
class Task:
    """Represents a task to be executed."""
    id: str
    description: str
    status: str = "pending"  # pending, in_progress, completed, failed
    result: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class Agent:
    """Represents an agent in the system."""
    id: str
    name: str
    role: str
    capabilities: List[str] = field(default_factory=list)
    status: str = "idle"


# ---------------------------------------------------------------------------
# Agent Base Classes
# ---------------------------------------------------------------------------

class BaseAgent(ABC):
    """Base class for all agents."""

    def __init__(self, agent_id: str, name: str, role: str):
        self.id = agent_id
        self.name = name
        self.role = role
        self.status = "idle"

    @abstractmethod
    def execute(self, task: Task) -> Task:
        """Execute a task and return the result."""

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "role": self.role,
            "status": self.status,
        }


class PlannerAgent(BaseAgent):
    """Agent responsible for planning tasks."""

    def __init__(self, agent_id: str = "planner_001"):
        super().__init__(agent_id, "Planner", "planning")

    def execute(self, task: Task) -> Task:
        """Plan a task by breaking it into subtasks."""
        logger.info(f"Planning task: {task.description}")
        self.status = "working"
        
        # Simple planning logic - can be enhanced with LLM
        plan = {
            "original_task": task.description,
            "steps": [
                f"Analyze: {task.description}",
                "Determine required tools",
                "Execute step by step",
                "Verify results",
            ]
        }
        
        task.metadata["plan"] = plan
        task.status = "planned"
        self.status = "idle"
        return task


class ExecutionAgent(BaseAgent):
    """Agent responsible for executing task plans."""

    def __init__(self, agent_id: str = "executor_001"):
        super().__init__(agent_id, "Executor", "execution")

    def execute(self, task: Task) -> Task:
        """Execute a planned task."""
        logger.info(f"Executing task: {task.description}")
        self.status = "working"
        
        # Simulate execution
        task.result = f"Executed: {task.description}"
        task.status = "completed"
        self.status = "idle"
        return task


class ToolAgent(BaseAgent):
    """Agent responsible for using tools."""

    def __init__(self, agent_id: str = "tool_001"):
        super().__init__(agent_id, "Tool User", "tool_usage")
        self.tools: Dict[str, Any] = {}

    def register_tool(self, tool_name: str, tool: Any) -> None:
        """Register a tool for this agent."""
        self.tools[tool_name] = tool

    def execute(self, task: Task) -> Task:
        """Execute a task using available tools."""
        logger.info(f"Tool agent processing: {task.description}")
        self.status = "working"
        
        # Check if any registered tool can handle this task
        for tool_name, tool in self.tools.items():
            if tool_name.lower() in task.description.lower():
                task.result = f"Used tool '{tool_name}' for: {task.description}"
                task.status = "completed"
                self.status = "idle"
                return task
        
        task.result = f"No suitable tool found for: {task.description}"
        task.status = "failed"
        self.status = "idle"
        return task


class ResearchAgent(BaseAgent):
    """Agent specialized in research tasks."""

    def __init__(self, agent_id: str = "research_001"):
        super().__init__(agent_id, "Researcher", "research")

    def execute(self, task: Task) -> Task:
        """Execute research task."""
        logger.info(f"Researching: {task.description}")
        self.status = "working"
        
        task.result = f"Research completed for: {task.description}"
        task.status = "completed"
        self.status = "idle"
        return task


class CodeAgent(BaseAgent):
    """Agent specialized in code tasks."""

    def __init__(self, agent_id: str = "coder_001"):
        super().__init__(agent_id, "Coder", "coding")

    def execute(self, task: Task) -> Task:
        """Execute code task."""
        logger.info(f"Coding: {task.description}")
        self.status = "working"
        
        task.result = f"Code generated for: {task.description}"
        task.status = "completed"
        self.status = "idle"
        return task


# ---------------------------------------------------------------------------
# Task Coordinator
# ---------------------------------------------------------------------------

class TaskCoordinator:
    """Coordinates tasks between multiple agents and tools.
    
    Integrates OpenManus TaskCoordinator into mcp_master ecosystem.
    Provides multi-agent task planning and execution.
    """

    def __init__(self):
        self.agents: Dict[str, BaseAgent] = {}
        self.tasks: Dict[str, Task] = {}
        self._initialize_agents()

    def _initialize_agents(self) -> None:
        """Initialize default agents."""
        agents = [
            PlannerAgent(),
            ExecutionAgent(),
            ToolAgent(),
            ResearchAgent(),
            CodeAgent(),
        ]
        for agent in agents:
            self.agents[agent.id] = agent

    def register_agent(self, agent: BaseAgent) -> None:
        """Register a new agent."""
        self.agents[agent.id] = agent
        logger.info(f"Registered agent: {agent.name} ({agent.id})")

    def create_task(self, task_id: str, description: str) -> Task:
        """Create a new task."""
        task = Task(id=task_id, description=description)
        self.tasks[task_id] = task
        return task

    def execute_task(self, task_id: str) -> Task:
        """Execute a task using the coordinator."""
        if task_id not in self.tasks:
            raise ValueError(f"Task {task_id} not found")
        
        task = self.tasks[task_id]
        task.status = "in_progress"
        
        # Step 1: Plan the task
        planner = self.agents.get("planner_001")
        if planner:
            task = planner.execute(task)
        
        # Step 2: Determine which agent should execute
        agent = self._select_agent(task)
        if agent:
            task = agent.execute(task)
        else:
            # Fallback to execution agent
            execution_agent = self.agents.get("executor_001")
            if execution_agent:
                task = execution_agent.execute(task)
        
        return task

    def _select_agent(self, task: Task) -> Optional[BaseAgent]:
        """Select the best agent for a task."""
        task_lower = task.description.lower()
        
        # Simple keyword-based routing
        if any(word in task_lower for word in ["research", "search", "find", "look up"]):
            return self.agents.get("research_001")
        elif any(word in task_lower for word in ["code", "program", "script", "develop"]):
            return self.agents.get("coder_001")
        elif any(word in task_lower for word in ["tool", "use", "call"]):
            return self.agents.get("tool_001")
        
        return None

    def get_agent_status(self, agent_id: str) -> Optional[Dict[str, Any]]:
        """Get status of an agent."""
        agent = self.agents.get(agent_id)
        if agent:
            return agent.to_dict()
        return None

    def list_agents(self) -> List[Dict[str, Any]]:
        """List all agents."""
        return [agent.to_dict() for agent in self.agents.values()]

    def get_task_status(self, task_id: str) -> Optional[Task]:
        """Get status of a task."""
        return self.tasks.get(task_id)

    def list_tasks(self) -> List[Task]:
        """List all tasks."""
        return list(self.tasks.values())


# ---------------------------------------------------------------------------
# Export
# ---------------------------------------------------------------------------

__all__ = [
    "Task",
    "Agent",
    "BaseAgent",
    "PlannerAgent",
    "ExecutionAgent",
    "ToolAgent",
    "ResearchAgent",
    "CodeAgent",
    "TaskCoordinator",
]