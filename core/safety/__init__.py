# AETHELGARD MERGED FILE
# Origin Repository: Aethelgard Core
# Original Path: core/safety/__init__.py
# Merge Date: 2026-05-07T14:23:10Z
# ---

"""
Aethelgard Safety & Virus Detection Module
Dual-layer security system for malware detection and file regeneration.
"""

from .scanner import SignatureScanner, HeuristicScanner
from .quarantine import QuarantineManager
from .regenerator import FileRegenerator

__all__ = ['SignatureScanner', 'HeuristicScanner', 'QuarantineManager', 'FileRegenerator']
