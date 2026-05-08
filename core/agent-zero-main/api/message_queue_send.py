# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\api\message_queue_send.py
# Merge Date: 2026-05-07T19:26:34.818432
# ---

from helpers.api import ApiHandler, Request, Response
from helpers import message_queue as mq
from agent import AgentContext
from helpers.state_monitor_integration import mark_dirty_for_context

class MessageQueueSend(ApiHandler):
    """Send queued message(s) immediately."""

    async def process(self, input: dict, request: Request) -> dict | Response:
        context = AgentContext.get(input.get("context", ""))
        if not context:
            return Response("Context not found", status=404)

        if not mq.has_queue(context):
            return {"ok": True, "message": "Queue empty"}

        item_id = input.get("item_id")
        send_all = input.get("send_all", False)

        if send_all:
            count = mq.send_all_aggregated(context)
            return {"ok": True, "sent_count": count}

        # Send single item
        item = mq.pop_item(context, item_id) if item_id else mq.pop_first(context)
        if not item:
            return Response("Item not found", status=404)

        mq.send_message(context, item)
        mark_dirty_for_context(context.id, reason="message_queue_send")
        return {"ok": True, "sent_item_id": item["id"]}
