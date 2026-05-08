# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\helpers\state_monitor_integration.py
# Merge Date: 2026-05-07T19:27:10.977982
# ---

from __future__ import annotations


def mark_dirty_all(*, reason: str | None = None) -> None:
    from helpers.state_monitor import get_state_monitor

    get_state_monitor().mark_dirty_all(reason=reason)


def mark_dirty_for_context(context_id: str, *, reason: str | None = None) -> None:
    from helpers.state_monitor import get_state_monitor

    get_state_monitor().mark_dirty_for_context(context_id, reason=reason)
