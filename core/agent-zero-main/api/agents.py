# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\api\agents.py
# Merge Date: 2026-05-07T19:26:27.422430
# ---

from helpers.api import ApiHandler, Input, Output, Request
from helpers import subagents


class Agents(ApiHandler):
    async def process(self, input: Input, request: Request) -> Output:
        action = input.get("action", "")

        try:
            if action == "list":
                data = subagents.get_all_agents_list()
            else:
                raise Exception("Invalid action")

            return {
                "ok": True,
                "data": data,
            }
        except Exception as e:
            return {
                "ok": False,
                "error": str(e),
            }
