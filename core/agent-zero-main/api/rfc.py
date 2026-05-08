# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\api\rfc.py
# Merge Date: 2026-05-07T19:26:37.043434
# ---

from helpers.api import ApiHandler, Request, Response

from helpers import runtime

class RFC(ApiHandler):

    @classmethod
    def requires_csrf(cls) -> bool:
        return False

    @classmethod
    def requires_auth(cls) -> bool:
        return False

    async def process(self, input: dict, request: Request) -> dict | Response:
        result = await runtime.handle_rfc(input) # type: ignore
        return result
