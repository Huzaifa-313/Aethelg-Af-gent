# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: clawspring\subagent.py
# Merge Date: 2026-05-07T19:18:58.548685
# ---

"""Backward-compatibility shim — real implementation is in multi_agent/subagent.py."""
from multi_agent.subagent import (  # noqa: F401
    AgentDefinition,
    SubAgentTask,
    SubAgentManager,
    load_agent_definitions,
    get_agent_definition,
    _extract_final_text,
    _agent_run,
    _BUILTIN_AGENTS,
)
