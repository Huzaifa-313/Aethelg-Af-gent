# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_skills\extensions\python\message_loop_prompts_after\_66_include_active_skills.py
# Merge Date: 2026-05-07T19:28:04.329396
# ---

from __future__ import annotations

from helpers import skills
from agent import LoopData
from helpers.extension import Extension


class IncludeActiveSkills(Extension):
    async def execute(self, loop_data: LoopData = LoopData(), **kwargs):
        if not self.agent:
            return

        extras = loop_data.extras_persistent
        extras.pop("active_skills", None)

        content = skills.build_active_skills_prompt(self.agent)
        if not content:
            return

        extras["active_skills"] = self.agent.read_prompt(
            "agent.system.active_skills.md",
            skills=content,
        )
