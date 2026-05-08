# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\api\nudge.py
# Merge Date: 2026-05-07T19:26:35.693430
# ---

from helpers.api import ApiHandler, Request, Response

class Nudge(ApiHandler):
    async def process(self, input: dict, request: Request) -> dict | Response:
        ctxid = input.get("ctxid", "")
        if not ctxid:
            raise Exception("No context id provided")

        context = self.use_context(ctxid)
        context.nudge()

        msg = "Process reset, agent nudged."
        context.log.log(type="info", content=msg)
        
        return {
            "message": msg,
            "ctxid": context.id,
        }