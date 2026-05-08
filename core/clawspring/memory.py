# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: clawspring\memory.py
# Merge Date: 2026-05-07T19:18:58.141687
# ---

"""Backward-compatibility shim — real implementation is in memory/ package."""
from memory.store import (  # noqa: F401
    MemoryEntry,
    save_memory,
    delete_memory,
    load_index,
    search_memory,
    get_index_content,
    parse_frontmatter,
)
from memory.context import get_memory_context  # noqa: F401
