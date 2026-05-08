# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\api\notifications_history.py
# Merge Date: 2026-05-07T19:26:35.137435
# ---

from helpers.api import ApiHandler
from flask import Request, Response
from agent import AgentContext


class NotificationsHistory(ApiHandler):
    @classmethod
    def requires_auth(cls) -> bool:
        return True

    async def process(self, input: dict, request: Request) -> dict | Response:
        # Get the global notification manager
        notification_manager = AgentContext.get_notification_manager()

        # Return all notifications for history modal
        notifications = notification_manager.output_all()
        return {
            "notifications": notifications,
            "guid": notification_manager.guid,
            "count": len(notifications),
        }
