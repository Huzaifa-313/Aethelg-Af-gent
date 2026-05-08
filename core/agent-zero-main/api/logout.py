# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\api\logout.py
# Merge Date: 2026-05-07T19:26:33.755431
# ---

from helpers.api import ApiHandler, Request, session


class ApiLogout(ApiHandler):
    @classmethod
    def requires_auth(cls) -> bool:
        return False

    async def process(self, input: dict, request: Request) -> dict:
        try:
            session.clear()
        except Exception:
            session.pop("authentication", None)
            session.pop("csrf_token", None)
        return {"ok": True}
