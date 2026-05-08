# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\extensions\python\system_prompt\_13_skills_prompt.py
# Merge Date: 2026-05-07T19:26:58.137980
# ---

from typing import Any

from helpers.extension import Extension, extensible
from helpers import skills as skills_helper
from agent import Agent, LoopData


class SkillsPrompt(Extension):

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
    available = skills_helper.list_skills(agent=agent)
    result: list[str] = []
    for skill in available:
        name = skill.name.strip().replace("\n", " ")[:100]
        descr = skill.description.replace("\n", " ")[:500]
        result.append(f"**{name}** {descr}")

    if not result:
        return ""

    return agent.read_prompt("agent.system.skills.md", skills="\n".join(result))
