# AETHELGARD MERGED FILE
# Origin Repository: Aethelgard Core
# Original Path: core/__init__.py
# Merge Date: 2026-05-07T14:29:00Z
# ---

"""
Aethelgard - Autonomous AI Agent Platform
===========================================

A fully modular, self-improving AI agent platform capable of hunting,
vetting, and integrating external agents/tools from GitHub.

Features:
- GitHub Agent Hunter for discovering new capabilities
- Dual-layer virus detection and file regeneration
- Unified agent orchestrator for task management
- Safe merge engine for repository integration
- Comprehensive safety and quarantine system
"""

__version__ = "1.0.0"
__author__ = "Aethelgard Team"
__license__ = "MIT"

from .orchestrator import AgentOrchestrator
from .hunter import AgentHunter
from .safety import SignatureScanner, HeuristicScanner, QuarantineManager, FileRegenerator

__all__ = [
    'AgentOrchestrator',
    'AgentHunter',
    'SignatureScanner',
    'HeuristicScanner',
    'QuarantineManager',
    'FileRegenerator'
]

def get_version():
    """Return the current version of Aethelgard."""
    return __version__

def create_orchestrator():
    """Create a new orchestrator instance."""
    return AgentOrchestrator()
