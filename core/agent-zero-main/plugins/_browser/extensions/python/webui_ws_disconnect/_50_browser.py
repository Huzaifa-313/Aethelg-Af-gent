# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_browser\extensions\python\webui_ws_disconnect\_50_browser.py
# Merge Date: 2026-05-07T19:27:27.227868
# ---

from __future__ import annotations

from typing import Any

from helpers.extension import Extension
from plugins._browser.api.ws_browser import WsBrowser


class BrowserWebuiWsDisconnect(Extension):
    async def execute(
        self,
        instance: Any = None,
        sid: str = "",
        **kwargs: Any,
    ) -> None:
        if instance is None:
            return
        handler = WsBrowser(
            instance.socketio,
            instance.lock,
            manager=instance.manager,
            namespace=instance.namespace,
        )
        await handler.on_disconnect(sid)
