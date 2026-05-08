# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\extensions\python\util_model_call_before\_10_mask_secrets.py
# Merge Date: 2026-05-07T19:26:59.104980
# ---

from helpers.extension import Extension
from helpers.secrets import get_secrets_manager


class MaskToolSecrets(Extension):

    async def execute(self, **kwargs):
        if not self.agent:
            return
            
        # model call data
        call_data:dict = kwargs.get("call_data", {})
            
        secrets_mgr = get_secrets_manager(self.agent.context)
        
        # mask system and user message
        if system:=call_data.get("system"):
            call_data["system"] = secrets_mgr.mask_values(system)
        if message:=call_data.get("message"):
            call_data["message"] = secrets_mgr.mask_values(message)