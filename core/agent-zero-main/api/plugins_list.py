# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\api\plugins_list.py
# Merge Date: 2026-05-07T19:26:36.211429
# ---

from helpers.api import ApiHandler, Input, Output, Request
from helpers import plugins

class PluginsList(ApiHandler):
    async def process(self, input: Input, request: Request) -> Output:
        filter = input.get("filter", {})

        custom = filter.get("custom", False)
        builtin = filter.get("builtin", False)

        plugin_list = plugins.get_enhanced_plugins_list(custom=custom, builtin=builtin)
        
        return {"ok": True, "plugins": [p.model_dump(mode="json") for p in plugin_list]}
