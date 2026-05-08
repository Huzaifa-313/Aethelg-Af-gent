# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\api\notifications_mark_read.py
# Merge Date: 2026-05-07T19:26:35.300432
# ---

from helpers.api import ApiHandler
from flask import Request, Response
from agent import AgentContext


class NotificationsMarkRead(ApiHandler):
    @classmethod
    def requires_auth(cls) -> bool:
        return True

    async def process(self, input: dict, request: Request) -> dict | Response:
        notification_ids = input.get("notification_ids", [])
        mark_all = input.get("mark_all", False)

        notification_manager = AgentContext.get_notification_manager()

        if mark_all:
            notification_manager.mark_all_read()
            return {"success": True, "message": "All notifications marked as read"}

        if not notification_ids:
            return {"success": False, "error": "No notification IDs provided"}

        if not isinstance(notification_ids, list):
            return {"success": False, "error": "notification_ids must be a list"}

        # Mark specific notifications as read
        marked_count = notification_manager.mark_read_by_ids(notification_ids)

        return {
            "success": True,
            "marked_count": marked_count,
            "message": f"Marked {marked_count} notifications as read"
        }
