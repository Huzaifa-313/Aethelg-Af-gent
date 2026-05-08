# AETHELGARD MERGED FILE
# Origin Repository: free-claude-code-main
# Original Path: api\__init__.py
# Merge Date: 2026-05-07T19:20:43.101763
# ---

"""API layer for Claude Code Proxy."""

from .app import app, create_app
from .dependencies import get_provider, get_provider_for_type
from .models import (
    MessagesRequest,
    MessagesResponse,
    TokenCountRequest,
    TokenCountResponse,
)

__all__ = [
    "MessagesRequest",
    "MessagesResponse",
    "TokenCountRequest",
    "TokenCountResponse",
    "app",
    "create_app",
    "get_provider",
    "get_provider_for_type",
]
