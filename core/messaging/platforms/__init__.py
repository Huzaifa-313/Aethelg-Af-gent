# AETHELGARD MERGED FILE
# Origin Repository: free-claude-code-main
# Original Path: messaging\platforms\__init__.py
# Merge Date: 2026-05-07T19:20:47.966765
# ---

"""Messaging platform adapters (Telegram, Discord, etc.)."""

from .base import CLISession, MessagingPlatform, SessionManagerInterface
from .factory import create_messaging_platform

__all__ = [
    "CLISession",
    "MessagingPlatform",
    "SessionManagerInterface",
    "create_messaging_platform",
]
