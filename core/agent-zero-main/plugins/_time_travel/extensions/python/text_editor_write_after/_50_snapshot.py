# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_time_travel\extensions\python\text_editor_write_after\_50_snapshot.py
# Merge Date: 2026-05-07T19:28:09.535393
# ---

from __future__ import annotations

from typing import Any

from helpers.extension import Extension
from plugins._time_travel.helpers.time_travel import snapshot_for_agent


class TimeTravelTextEditorWriteSnapshot(Extension):
    async def execute(self, data: dict[str, Any] | None = None, **kwargs: Any):
        snapshot_for_agent(
            self.agent,
            trigger="text_editor_write",
            metadata={
                "changed_path_hints": [str((data or {}).get("path") or "")],
            },
        )
