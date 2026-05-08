# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_oauth\api\disconnect.py
# Merge Date: 2026-05-07T19:27:46.248395
# ---

from __future__ import annotations

from helpers.api import ApiHandler, Request
from plugins._oauth.helpers import codex


class Disconnect(ApiHandler):
    async def process(self, input: dict, request: Request) -> dict:
        try:
            result = codex.disconnect_auth()
            return {
                "ok": True,
                **result,
                "codex": codex.status(),
            }
        except Exception as exc:
            return {"ok": False, "error": str(exc)}
