# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_oauth\extensions\python\startup_migration\_20_oauth_routes.py
# Merge Date: 2026-05-07T19:27:51.183397
# ---

from __future__ import annotations

from helpers.extension import Extension
from plugins._oauth.helpers.route_bootstrap import install_route_hooks


class OAuthRoutesStartup(Extension):
    def execute(self, **kwargs):
        install_route_hooks()
