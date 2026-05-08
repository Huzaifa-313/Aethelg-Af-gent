# AETHELGARD MERGED FILE
# Origin Repository: Aethelgard Core
# Original Path: core/hunter/__init__.py
# Merge Date: 2026-05-07T14:20:11Z
# ---

"""
Aethelgard Agent Hunter Module
Discovers, analyzes, and integrates external AI agent repositories from GitHub.
"""

from .hunter import AgentHunter
from .github_client import GitHubClient
from .analyzer import RepoAnalyzer

__all__ = ['AgentHunter', 'GitHubClient', 'RepoAnalyzer']
