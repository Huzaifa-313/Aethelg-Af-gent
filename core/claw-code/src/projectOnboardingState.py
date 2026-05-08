# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claw-code\src\projectOnboardingState.py
# Merge Date: 2026-05-07T19:18:49.110686
# ---

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class ProjectOnboardingState:
    has_readme: bool
    has_tests: bool
    python_first: bool = True
