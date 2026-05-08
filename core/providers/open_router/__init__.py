# AETHELGARD MERGED FILE
# Origin Repository: free-claude-code-main
# Original Path: providers\open_router\__init__.py
# Merge Date: 2026-05-07T19:20:51.624762
# ---

"""OpenRouter provider - Anthropic-compatible and rollback transports."""

from .client import OPENROUTER_BASE_URL, OpenRouterChatProvider, OpenRouterProvider

__all__ = ["OPENROUTER_BASE_URL", "OpenRouterChatProvider", "OpenRouterProvider"]
