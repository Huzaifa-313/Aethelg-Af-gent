# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_skills\hooks.py
# Merge Date: 2026-05-07T19:28:03.872397
# ---

from __future__ import annotations

from helpers.skills import normalize_skills_config


def get_plugin_config(default=None, **kwargs):
    return normalize_skills_config(default)


def save_plugin_config(settings=None, **kwargs):
    return normalize_skills_config(settings)
