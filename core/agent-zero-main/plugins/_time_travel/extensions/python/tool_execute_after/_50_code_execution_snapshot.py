# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_time_travel\extensions\python\tool_execute_after\_50_code_execution_snapshot.py
# Merge Date: 2026-05-07T19:28:09.674398
# ---

from __future__ import annotations

from typing import Any

from helpers.extension import Extension
from plugins._time_travel.helpers.time_travel import snapshot_for_agent


class TimeTravelCodeExecutionSnapshot(Extension):
    async def execute(self, tool_name: str = "", response: Any = None, **kwargs: Any):
        if tool_name != "code_execution_tool" or not self.agent:
            return

        tool = getattr(getattr(self.agent, "loop_data", None), "current_tool", None)
        args = getattr(tool, "args", {}) if tool else {}
        runtime = str(args.get("runtime") or "") if isinstance(args, dict) else ""
        if runtime == "output":
            return

        snapshot_for_agent(
            self.agent,
            trigger="code_execution",
            metadata={
                "tool_name": tool_name,
                "runtime": runtime,
            },
        )
