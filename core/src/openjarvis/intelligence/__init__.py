# AETHELGARD MERGED FILE
# Origin Repository: OpenJarvis-main
# Original Path: src\openjarvis\intelligence\__init__.py
# Merge Date: 2026-05-07T19:12:46.922453
# ---

"""Intelligence primitive — the model definition and catalog."""

from __future__ import annotations

from openjarvis.intelligence.model_catalog import (
    BUILTIN_MODELS,
    merge_discovered_models,
    register_builtin_models,
)

__all__ = ["BUILTIN_MODELS", "merge_discovered_models", "register_builtin_models"]
