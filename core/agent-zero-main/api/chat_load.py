# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\api\chat_load.py
# Merge Date: 2026-05-07T19:26:30.232430
# ---

from helpers.api import ApiHandler, Input, Output, Request, Response


from helpers import persist_chat

class LoadChats(ApiHandler):
    async def process(self, input: Input, request: Request) -> Output:
        chats = input.get("chats", [])
        if not chats:
            raise Exception("No chats provided")

        ctxids = persist_chat.load_json_chats(chats)

        return {
            "message": "Chats loaded.",
            "ctxids": ctxids,
        }
