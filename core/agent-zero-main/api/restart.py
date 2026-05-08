# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\api\restart.py
# Merge Date: 2026-05-07T19:26:36.878432
# ---

from helpers.api import ApiHandler, Request, Response

from helpers import process

class Restart(ApiHandler):
    async def process(self, input: dict, request: Request) -> dict | Response:
        process.reload()
        return Response(status=200)