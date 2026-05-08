# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\extensions\python\monologue_end\_90_waiting_for_input_msg.py
# Merge Date: 2026-05-07T19:26:50.355948
# ---

from helpers.extension import Extension
from agent import LoopData

class WaitingForInputMsg(Extension):

    async def execute(self, loop_data: LoopData = LoopData(), **kwargs):
        if not self.agent:
            return
            
        # show temp info message
        if self.agent.number == 0:
            self.agent.context.log.set_initial_progress()
