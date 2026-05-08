# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_infection_check\extensions\python\response_stream_end\_50_infection_analyze.py
# Merge Date: 2026-05-07T19:27:39.745394
# ---

from helpers.extension import Extension
from agent import LoopData
from plugins._infection_check.helpers.checker import get_checker


class InfectionAnalyzeEnd(Extension):
    async def execute(self, loop_data=LoopData(), **kwargs):
        if not self.agent:
            return
        get_checker(self.agent).start_analysis(self.agent)
