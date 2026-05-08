# AETHELGARD MERGED FILE
# Origin Repository: free-claude-code-main
# Original Path: messaging\__init__.py
# Merge Date: 2026-05-07T19:20:47.392763
# ---

"""Platform-agnostic messaging layer."""

from .event_parser import parse_cli_event
from .handler import ClaudeMessageHandler
from .models import IncomingMessage
from .platforms.base import CLISession, MessagingPlatform, SessionManagerInterface
from .session import SessionStore
from .trees.data import MessageNode, MessageState, MessageTree
from .trees.queue_manager import TreeQueueManager

__all__ = [
    "CLISession",
    "ClaudeMessageHandler",
    "IncomingMessage",
    "MessageNode",
    "MessageState",
    "MessageTree",
    "MessagingPlatform",
    "SessionManagerInterface",
    "SessionStore",
    "TreeQueueManager",
    "parse_cli_event",
]
