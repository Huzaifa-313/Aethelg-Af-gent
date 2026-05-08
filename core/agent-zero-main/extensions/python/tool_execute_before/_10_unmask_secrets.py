# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\extensions\python\tool_execute_before\_10_unmask_secrets.py
# Merge Date: 2026-05-07T19:26:58.773979
# ---

from helpers.extension import Extension
from helpers.secrets import get_secrets_manager


class UnmaskToolSecrets(Extension):

    async def execute(self, **kwargs):
        if not self.agent:
            return

        # Get tool args from kwargs
        tool_args = kwargs.get("tool_args")
        if not tool_args:
            return

        secrets_mgr = get_secrets_manager(self.agent.context)

        # Unmask placeholders in args for actual tool execution
        for k, v in tool_args.items():
            if isinstance(v, str):
                tool_args[k] = secrets_mgr.replace_placeholders(v)
