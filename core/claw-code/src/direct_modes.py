# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claw-code\src\direct_modes.py
# Merge Date: 2026-05-07T19:18:47.627686
# ---

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class DirectModeReport:
    mode: str
    target: str
    active: bool

    def as_text(self) -> str:
        return f'mode={self.mode}\ntarget={self.target}\nactive={self.active}'


def run_direct_connect(target: str) -> DirectModeReport:
    return DirectModeReport(mode='direct-connect', target=target, active=True)


def run_deep_link(target: str) -> DirectModeReport:
    return DirectModeReport(mode='deep-link', target=target, active=True)
