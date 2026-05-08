# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\extensions\python\message_loop_start\_10_iteration_no.py
# Merge Date: 2026-05-07T19:26:49.925947
# ---

from helpers.extension import Extension
from agent import Agent, LoopData

DATA_NAME_ITER_NO = "iteration_no"

class IterationNo(Extension):
    async def execute(self, loop_data: LoopData = LoopData(), **kwargs):
        if not self.agent:
            return
            
        # total iteration number
        no = self.agent.get_data(DATA_NAME_ITER_NO) or 0
        self.agent.set_data(DATA_NAME_ITER_NO, no + 1)


def get_iter_no(agent: Agent) -> int:
    return agent.get_data(DATA_NAME_ITER_NO) or 0