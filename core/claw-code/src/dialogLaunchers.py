# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claw-code\src\dialogLaunchers.py
# Merge Date: 2026-05-07T19:18:47.493686
# ---

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class DialogLauncher:
    name: str
    description: str


DEFAULT_DIALOGS = (
    DialogLauncher('summary', 'Launch the Markdown summary view'),
    DialogLauncher('parity_audit', 'Launch the parity audit view'),
)
