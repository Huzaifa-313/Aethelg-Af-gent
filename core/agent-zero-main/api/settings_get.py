# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\api\settings_get.py
# Merge Date: 2026-05-07T19:26:38.616434
# ---

from helpers.api import ApiHandler, Request, Response

from helpers import settings

class GetSettings(ApiHandler):
    async def process(self, input: dict, request: Request) -> dict | Response:
        backend = settings.get_settings()
        out = settings.convert_out(backend)
        return dict(out)

    @classmethod
    def get_methods(cls) -> list[str]:
        return ["GET", "POST"]
