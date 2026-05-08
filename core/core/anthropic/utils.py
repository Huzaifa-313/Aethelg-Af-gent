# AETHELGARD MERGED FILE
# Origin Repository: free-claude-code-main
# Original Path: core\anthropic\utils.py
# Merge Date: 2026-05-07T19:20:45.666762
# ---

"""Small shared protocol utility helpers."""

from typing import Any


def set_if_not_none(body: dict[str, Any], key: str, value: Any) -> None:
    """Set ``body[key]`` only when value is not None."""
    if value is not None:
        body[key] = value
