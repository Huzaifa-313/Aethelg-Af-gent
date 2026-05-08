# AETHELGARD MERGED FILE
# Origin Repository: OpenJarvis-main
# Original Path: src\openjarvis\__init__.py
# Merge Date: 2026-05-07T19:12:11.609474
# ---

"""OpenJarvis — modular AI assistant backend with composable intelligence primitives."""

from __future__ import annotations

from importlib.metadata import PackageNotFoundError
from importlib.metadata import version as _pkg_version

from openjarvis.sdk import Jarvis, JarvisSystem, MemoryHandle, SystemBuilder

try:
    __version__ = _pkg_version("openjarvis")
except PackageNotFoundError:  # pragma: no cover — uninstalled source tree
    __version__ = "0.0.0+unknown"

__all__ = ["Jarvis", "JarvisSystem", "MemoryHandle", "SystemBuilder", "__version__"]
