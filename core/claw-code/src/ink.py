# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claw-code\src\ink.py
# Merge Date: 2026-05-07T19:18:48.036688
# ---

from __future__ import annotations


def render_markdown_panel(text: str) -> str:
    border = '=' * 40
    return f"{border}\n{text}\n{border}"
