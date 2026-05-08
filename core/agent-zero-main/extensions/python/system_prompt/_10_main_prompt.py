# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\extensions\python\system_prompt\_10_main_prompt.py
# Merge Date: 2026-05-07T19:26:57.621980
# ---

from typing import Any

from helpers.extension import Extension, extensible
from agent import Agent, LoopData


class MainPrompt(Extension):

    async def execute(
        self,
        system_prompt: list[str] = [],
        loop_data: LoopData = LoopData(),
        **kwargs: Any,
    ):
        if not self.agent:
            return
        prompt = await build_prompt(self.agent)
        system_prompt.append(prompt)


@extensible
async def build_prompt(agent: Agent) -> str:
    return agent.read_prompt("agent.system.main.md")
