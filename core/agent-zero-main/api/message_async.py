# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\api\message_async.py
# Merge Date: 2026-05-07T19:26:34.452433
# ---

from agent import AgentContext
from helpers.defer import DeferredTask
from api.message import Message


class MessageAsync(Message):
    async def respond(self, task: DeferredTask, context: AgentContext):
        return {
            "message": "Message received.",
            "context": context.id,
        }
