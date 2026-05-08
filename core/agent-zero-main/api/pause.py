# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\api\pause.py
# Merge Date: 2026-05-07T19:26:35.867432
# ---

from helpers.api import ApiHandler, Request, Response


class Pause(ApiHandler):
    async def process(self, input: dict, request: Request) -> dict | Response:
            # input data
            paused = input.get("paused", False)
            ctxid = input.get("context", "")

            # context instance - get or create
            context = self.use_context(ctxid)

            context.paused = paused

            return {
                "message": "Agent paused." if paused else "Agent unpaused.",
                "pause": paused,
            }    
