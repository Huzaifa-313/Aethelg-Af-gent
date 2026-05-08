# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_memory\api\knowledge_reindex.py
# Merge Date: 2026-05-07T19:27:40.537396
# ---

from helpers.api import ApiHandler, Request, Response
from plugins._memory.helpers.memory import Memory


class ReindexKnowledge(ApiHandler):
    async def process(self, input: dict, request: Request) -> dict | Response:
        ctxid = input.get("ctxid", "")
        if not ctxid:
            raise Exception("No context id provided")
        context = self.use_context(ctxid)

        # reload memory to re-import knowledge
        await Memory.reload(context.agent0)
        context.log.set_initial_progress()

        return {
            "ok": True,
            "message": "Knowledge re-indexed",
        }
