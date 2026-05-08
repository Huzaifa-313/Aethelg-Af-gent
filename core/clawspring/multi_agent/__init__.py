# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: clawspring\multi_agent\__init__.py
# Merge Date: 2026-05-07T19:19:01.660705
# ---

"""Multi-agent package for clawspring.

Provides:
  - AgentDefinition  — typed agent definition (name, system_prompt, model, tools)
  - SubAgentTask     — lifecycle-tracked task
  - SubAgentManager  — thread-pool manager for spawning agents
  - load_agent_definitions / get_agent_definition — agent registry
"""
from .subagent import (
    AgentDefinition,
    SubAgentTask,
    SubAgentManager,
    load_agent_definitions,
    get_agent_definition,
)

__all__ = [
    "AgentDefinition",
    "SubAgentTask",
    "SubAgentManager",
    "load_agent_definitions",
    "get_agent_definition",
]
