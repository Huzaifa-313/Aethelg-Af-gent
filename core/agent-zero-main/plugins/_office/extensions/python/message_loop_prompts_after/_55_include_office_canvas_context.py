# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_office\extensions\python\message_loop_prompts_after\_55_include_office_canvas_context.py
# Merge Date: 2026-05-07T19:27:53.650398
# ---

from __future__ import annotations

from agent import LoopData
from helpers.extension import Extension
from plugins._office.helpers import canvas_context


class IncludeOfficeCanvasContext(Extension):
    async def execute(self, loop_data: LoopData = LoopData(), **kwargs):
        if not self.agent:
            return

        context = canvas_context.build_context()
        if not context:
            loop_data.extras_temporary.pop("office_canvas", None)
            return

        loop_data.extras_temporary["office_canvas"] = self.agent.read_prompt(
            "agent.extras.office_canvas.md",
            office_canvas=context,
        )
