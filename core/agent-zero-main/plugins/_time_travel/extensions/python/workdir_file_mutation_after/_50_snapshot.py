# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_time_travel\extensions\python\workdir_file_mutation_after\_50_snapshot.py
# Merge Date: 2026-05-07T19:28:09.798394
# ---

from __future__ import annotations

from typing import Any

from helpers.extension import Extension
from plugins._time_travel.helpers.time_travel import snapshot_for_path_hint


class TimeTravelWorkdirFileMutationSnapshot(Extension):
    async def execute(self, data: dict[str, Any] | None = None, **kwargs: Any):
        payload = data or {}
        paths = payload.get("paths")
        if not isinstance(paths, list):
            paths = [payload.get("path") or payload.get("current_path") or payload.get("parent_path")]

        first_path = next((str(path) for path in paths if path), "")
        if not first_path:
            return

        snapshot_for_path_hint(
            first_path,
            trigger=f"file_browser_{payload.get('action') or 'mutation'}",
            metadata={
                "source": "file_browser",
                "action": payload.get("action") or "mutation",
                "changed_path_hints": [str(path) for path in paths if path],
            },
        )
