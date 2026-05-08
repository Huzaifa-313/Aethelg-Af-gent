# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\api\ctx_window_get.py
# Merge Date: 2026-05-07T19:26:30.857431
# ---

from helpers.api import ApiHandler, Input, Output, Request, Response

from helpers import tokens


class GetCtxWindow(ApiHandler):
    async def process(self, input: Input, request: Request) -> Output:
        ctxid = input.get("context", [])
        context = self.use_context(ctxid)
        agent = context.streaming_agent or context.agent0
        window = agent.get_data(agent.DATA_NAME_CTX_WINDOW)
        if not window or not isinstance(window, dict):
            return {"content": "", "tokens": 0}

        text = window["text"]
        tokens = window["tokens"]

        return {"content": text, "tokens": tokens}
