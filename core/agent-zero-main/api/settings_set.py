# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\api\settings_set.py
# Merge Date: 2026-05-07T19:26:38.782433
# ---

from helpers.api import ApiHandler, Request, Response

from helpers import settings

from typing import Any


class SetSettings(ApiHandler):
    async def process(self, input: dict[Any, Any], request: Request) -> dict[Any, Any] | Response:
        frontend = input.get("settings", input)
        backend = settings.convert_in(settings.Settings(**frontend))
        backend = settings.set_settings(backend)
        out = settings.convert_out(backend)
        return dict(out)
