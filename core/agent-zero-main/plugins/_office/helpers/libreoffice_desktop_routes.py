# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_office\helpers\libreoffice_desktop_routes.py
# Merge Date: 2026-05-07T19:27:56.386397
# ---

from __future__ import annotations

from helpers.virtual_desktop_routes import (
    VirtualDesktopGateway as LibreOfficeDesktopGateway,
    install_route_hooks,
    is_installed,
)


__all__ = [
    "LibreOfficeDesktopGateway",
    "install_route_hooks",
    "is_installed",
]
