# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\extensions\python\system_prompt\_12_mcp_prompt.py
# Merge Date: 2026-05-07T19:26:57.904981
# ---

from typing import Any

from helpers.extension import Extension, extensible
from helpers.mcp_handler import MCPConfig
from agent import Agent, LoopData


class MCPToolsPrompt(Extension):

    async def execute(
        self,
        system_prompt: list[str] = [],
        loop_data: LoopData = LoopData(),
        **kwargs: Any,
    ):
        if not self.agent:
            return
        prompt = await build_prompt(self.agent)
        if prompt:
            system_prompt.append(prompt)


@extensible
async def build_prompt(agent: Agent) -> str:
    mcp_config = MCPConfig.get_instance()
    if not mcp_config.servers:
        return ""

    pre_progress = agent.context.log.progress
    agent.context.log.set_progress("Collecting MCP tools")
    tools = mcp_config.get_tools_prompt()
    agent.context.log.set_progress(pre_progress)
    return tools
