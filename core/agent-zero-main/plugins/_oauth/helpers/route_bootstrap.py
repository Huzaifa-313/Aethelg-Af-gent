# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_oauth\helpers\route_bootstrap.py
# Merge Date: 2026-05-07T19:27:52.104397
# ---

from __future__ import annotations


def install_route_hooks() -> None:
    from helpers.ui_server import UiServerRuntime

    if getattr(UiServerRuntime, "_a0_oauth_route_hooks_installed", False):
        return

    original_register_http_routes = UiServerRuntime.register_http_routes

    def register_http_routes(self):
        result = original_register_http_routes(self)
        from plugins._oauth.helpers.routes import register_oauth_routes

        register_oauth_routes(self.webapp)
        return result

    UiServerRuntime.register_http_routes = register_http_routes
    UiServerRuntime._a0_oauth_route_hooks_installed = True


def is_installed() -> bool:
    from helpers.ui_server import UiServerRuntime

    return bool(getattr(UiServerRuntime, "_a0_oauth_route_hooks_installed", False))
