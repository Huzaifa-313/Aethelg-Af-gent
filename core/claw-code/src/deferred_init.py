# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claw-code\src\deferred_init.py
# Merge Date: 2026-05-07T19:18:47.373685
# ---

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class DeferredInitResult:
    trusted: bool
    plugin_init: bool
    skill_init: bool
    mcp_prefetch: bool
    session_hooks: bool

    def as_lines(self) -> tuple[str, ...]:
        return (
            f'- plugin_init={self.plugin_init}',
            f'- skill_init={self.skill_init}',
            f'- mcp_prefetch={self.mcp_prefetch}',
            f'- session_hooks={self.session_hooks}',
        )


def run_deferred_init(trusted: bool) -> DeferredInitResult:
    enabled = bool(trusted)
    return DeferredInitResult(
        trusted=trusted,
        plugin_init=enabled,
        skill_init=enabled,
        mcp_prefetch=enabled,
        session_hooks=enabled,
    )
