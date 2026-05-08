# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claw-code\src\interactiveHelpers.py
# Merge Date: 2026-05-07T19:18:48.163684
# ---

from __future__ import annotations


def bulletize(items: list[str]) -> str:
    return '\n'.join(f'- {item}' for item in items)
