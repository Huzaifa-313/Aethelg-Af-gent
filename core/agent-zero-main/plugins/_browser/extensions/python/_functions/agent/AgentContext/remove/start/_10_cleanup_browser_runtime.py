# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_browser\extensions\python\_functions\agent\AgentContext\remove\start\_10_cleanup_browser_runtime.py
# Merge Date: 2026-05-07T19:27:27.529867
# ---

from helpers.extension import Extension
from plugins._browser.helpers.runtime import close_runtime_sync


class CleanupBrowserRuntimeOnRemove(Extension):
    def execute(self, data: dict = {}, **kwargs):
        args = data.get("args", ())
        context_id = args[0] if isinstance(args, tuple) and args else ""
        if context_id:
            close_runtime_sync(str(context_id), delete_profile=True)
