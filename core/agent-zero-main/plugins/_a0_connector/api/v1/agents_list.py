# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_a0_connector\api\v1\agents_list.py
# Merge Date: 2026-05-07T19:27:16.984867
# ---

"""POST /api/plugins/_a0_connector/v1/agents_list."""
from __future__ import annotations

from helpers.api import Request, Response
import plugins._a0_connector.api.v1.base as connector_base


class AgentsList(connector_base.ProtectedConnectorApiHandler):
    async def process(self, input: dict, request: Request) -> dict | Response:
        from helpers import subagents

        return {
            "ok": True,
            "data": subagents.get_all_agents_list(),
        }
