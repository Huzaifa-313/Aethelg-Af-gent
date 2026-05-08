# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\extensions\python\error_format\_10_mask_errors.py
# Merge Date: 2026-05-07T19:26:47.671431
# ---

from helpers.extension import Extension
from helpers.secrets import get_secrets_manager


class MaskErrorSecrets(Extension):

    async def execute(self, **kwargs):
        if not self.agent:
            return
        
        # Get error data from kwargs
        msg = kwargs.get("msg")
        if not msg:
            return

        secrets_mgr = get_secrets_manager(self.agent.context)

        # Mask the error message
        if "message" in msg:
            msg["message"] = secrets_mgr.mask_values(msg["message"])
