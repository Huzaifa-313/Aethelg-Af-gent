# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\extensions\python\job_loop\_50_trim_cache.py
# Merge Date: 2026-05-07T19:26:48.067431
# ---

from typing import Any
from helpers.extension import Extension
from helpers import cache


class SaveToolCallFile(Extension):
    def execute(self, data: dict[str, Any] | None = None, **kwargs):
        # trim unused cache entries
        cache.trim_cache("*", seconds=300)
