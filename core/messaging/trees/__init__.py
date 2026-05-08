# AETHELGARD MERGED FILE
# Origin Repository: free-claude-code-main
# Original Path: messaging\trees\__init__.py
# Merge Date: 2026-05-07T19:20:49.074764
# ---

"""Message tree data structures and queue management."""

from .data import MessageNode, MessageState, MessageTree
from .queue_manager import TreeQueueManager

__all__ = [
    "MessageNode",
    "MessageState",
    "MessageTree",
    "TreeQueueManager",
]
