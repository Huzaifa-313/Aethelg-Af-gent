# AETHELGARD MERGED FILE
# Origin Repository: everything-claude-code-main
# Original Path: skills\skill-comply\scripts\utils.py
# Merge Date: 2026-05-07T19:20:31.474206
# ---

"""Shared utilities for skill-comply scripts."""

from __future__ import annotations


def extract_yaml(text: str) -> str:
    """Extract YAML from LLM output, stripping markdown fences if present."""
    lines = text.strip().splitlines()
    if lines and lines[0].startswith("```"):
        lines = lines[1:]
    if lines and lines[-1].startswith("```"):
        lines = lines[:-1]
    return "\n".join(lines)
