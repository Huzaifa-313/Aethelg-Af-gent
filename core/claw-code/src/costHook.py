# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claw-code\src\costHook.py
# Merge Date: 2026-05-07T19:18:47.126687
# ---

from __future__ import annotations

from .cost_tracker import CostTracker


def apply_cost_hook(tracker: CostTracker, label: str, units: int) -> CostTracker:
    tracker.record(label, units)
    return tracker
