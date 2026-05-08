# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\api\history_get.py
# Merge Date: 2026-05-07T19:26:33.309431
# ---

from helpers.api import ApiHandler, Request, Response


class GetHistory(ApiHandler):
    async def process(self, input: dict, request: Request) -> dict | Response:
        ctxid = input.get("context", [])
        context = self.use_context(ctxid)
        agent = context.streaming_agent or context.agent0
        history = agent.history.output_text()
        size = agent.history.get_tokens()

        return {
            "history": history,
            "tokens": size
        }