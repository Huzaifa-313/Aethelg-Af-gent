# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claw-code\src\query.py
# Merge Date: 2026-05-07T19:18:49.229687
# ---

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class QueryRequest:
    prompt: str


@dataclass(frozen=True)
class QueryResponse:
    text: str
