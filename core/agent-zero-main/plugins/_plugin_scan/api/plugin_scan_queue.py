# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_plugin_scan\api\plugin_scan_queue.py
# Merge Date: 2026-05-07T19:27:58.877405
# ---

from agent import AgentContext
from helpers.api import ApiHandler, Input, Output, Request, Response
from helpers import message_queue as mq


class PluginScanQueue(ApiHandler):
    """Log the scan prompt into a chat before the scan starts."""

    async def process(self, input: Input, request: Request) -> Output:
        ctxid: str = input.get("context", "")
        text: str = input.get("text", "")

        if not ctxid or not text:
            return Response("Missing 'context' or 'text'.", 400)

        context = AgentContext.get(ctxid)
        if context is None:
            return Response(f"Context {ctxid} not found.", 404)

        mq.log_user_message(context, text, [])

        return {"ok": True, "context": ctxid}
