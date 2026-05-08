# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_browser\extensions\python\_functions\agent\AgentContext\reset\start\_10_cleanup_browser_runtime.py
# Merge Date: 2026-05-07T19:27:27.662874
# ---

from helpers.extension import Extension
from plugins._browser.helpers.runtime import close_runtime_sync


class CleanupBrowserRuntimeOnReset(Extension):
    def execute(self, data: dict = {}, **kwargs):
        args = data.get("args", ())
        context = args[0] if isinstance(args, tuple) and args else None
        context_id = getattr(context, "id", "")
        if context_id:
            close_runtime_sync(context_id, delete_profile=True)
