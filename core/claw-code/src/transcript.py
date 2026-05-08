# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claw-code\src\transcript.py
# Merge Date: 2026-05-07T19:18:51.344686
# ---

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class TranscriptStore:
    entries: list[str] = field(default_factory=list)
    flushed: bool = False

    def append(self, entry: str) -> None:
        self.entries.append(entry)
        self.flushed = False

    def compact(self, keep_last: int = 10) -> None:
        if len(self.entries) > keep_last:
            self.entries[:] = self.entries[-keep_last:]

    def replay(self) -> tuple[str, ...]:
        return tuple(self.entries)

    def flush(self) -> None:
        self.flushed = True
