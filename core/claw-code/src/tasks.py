# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claw-code\src\tasks.py
# Merge Date: 2026-05-07T19:18:50.785688
# ---

from __future__ import annotations

from .task import PortingTask


def default_tasks() -> list[PortingTask]:
    return [
        PortingTask('root-module-parity', 'Mirror the root module surface of the archived snapshot'),
        PortingTask('directory-parity', 'Mirror top-level subsystem names as Python packages'),
        PortingTask('parity-audit', 'Continuously measure parity against the local archive'),
    ]
