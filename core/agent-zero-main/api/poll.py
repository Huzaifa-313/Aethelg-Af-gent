# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\api\poll.py
# Merge Date: 2026-05-07T19:26:36.346430
# ---

from helpers.api import ApiHandler, Request, Response

from helpers.state_snapshot import build_snapshot


class Poll(ApiHandler):

    async def process(self, input: dict, request: Request) -> dict | Response:
        return await build_snapshot(
            context=input.get("context"),
            log_from=input.get("log_from", 0),
            notifications_from=input.get("notifications_from", 0),
            timezone=input.get("timezone"),
        )
