# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_infection_check\extensions\python\tool_execute_before\_50_infection_check.py
# Merge Date: 2026-05-07T19:27:39.851394
# ---

from helpers.extension import Extension
from plugins._infection_check.helpers.checker import get_checker


class InfectionAwaitCheck(Extension):
    async def execute(self, tool_name="", tool_args={}, **kwargs):
        if not self.agent:
            return
        await get_checker(self.agent).gate(
            self.agent, tool_name=tool_name, tool_args=tool_args
        )
