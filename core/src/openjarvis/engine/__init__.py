# AETHELGARD MERGED FILE
# Origin Repository: OpenJarvis-main
# Original Path: src\openjarvis\engine\__init__.py
# Merge Date: 2026-05-07T19:12:30.981454
# ---

"""Inference Engine primitive — LLM runtime management."""

from __future__ import annotations

import importlib

# Import engine modules to trigger @EngineRegistry.register() decorators
import openjarvis.engine.ollama  # noqa: F401
import openjarvis.engine.openai_compat_engines  # noqa: F401
from openjarvis.engine._base import (
    EngineConnectionError,
    InferenceEngine,
    messages_to_dicts,
)
from openjarvis.engine._discovery import discover_engines, discover_models, get_engine

# Optional engines — only register if their SDK deps are present
for _optional in ("cloud", "litellm", "gemma_cpp"):
    try:
        importlib.import_module(f".{_optional}", __name__)
    except ImportError:
        pass

__all__ = [
    "EngineConnectionError",
    "InferenceEngine",
    "discover_engines",
    "discover_models",
    "get_engine",
    "messages_to_dicts",
]
