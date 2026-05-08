#!/usr/bin/env python3
"""
Connector System - Service Integration Hub
Integrates OpenJarvis connectors (Gmail, Slack, Notion, etc.) into mcp_master.
Provides unified access to 30+ external services via MCP protocol.
"""

from __future__ import annotations

import json
import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, Iterator, List, Optional

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Base Types
# ---------------------------------------------------------------------------

@dataclass(slots=True)
class Attachment:
    """A file attached to a document."""
    filename: str
    mime_type: str
    size_bytes: int
    sha256: str = ""
    content: bytes = field(default=b"", repr=False)


@dataclass(slots=True)
class Document:
    """Universal schema for data from any connector."""
    doc_id: str
    source: str
    doc_type: str
    content: str
    title: str = ""
    author: str = ""
    participants: List[str] = field(default_factory=list)
    timestamp: datetime = field(default_factory=datetime.now)
    thread_id: Optional[str] = None
    url: Optional[str] = None
    attachments: List[Attachment] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class SyncStatus:
    """Progress of a connector's sync operation."""
    state: str = "idle"
    items_synced: int = 0
    items_total: int = 0
    last_sync: Optional[datetime] = None
    cursor: Optional[str] = None
    error: Optional[str] = None


class BaseConnector(ABC):
    """Abstract base for data source connectors."""

    connector_id: str
    display_name: str
    auth_type: str  # "oauth" | "local" | "bridge" | "filesystem"

    @abstractmethod
    def is_connected(self) -> bool:
        """Return True if the connector has valid credentials."""

    @abstractmethod
    def disconnect(self) -> None:
        """Revoke credentials and clean up."""

    @abstractmethod
    def sync(self, *, since: Optional[datetime] = None, cursor: Optional[str] = None) -> Iterator[Document]:
        """Yield documents from the data source."""

    @abstractmethod
    def sync_status(self) -> SyncStatus:
        """Return current sync progress."""

    def auth_url(self) -> str:
        """Generate an OAuth consent URL."""
        raise NotImplementedError(f"{self.connector_id} does not use OAuth")

    def handle_callback(self, code: str) -> None:
        """Handle the OAuth callback."""
        raise NotImplementedError(f"{self.connector_id} does not use OAuth")

    def mcp_tools(self) -> List[Dict[str, Any]]:
        """Return MCP tool specs for real-time agent queries."""
        return []


# ---------------------------------------------------------------------------
# Connector Registry
# ---------------------------------------------------------------------------

class ConnectorRegistry:
    """Registry for managing all connectors."""

    def __init__(self):
        self._connectors: Dict[str, BaseConnector] = {}

    def register(self, connector: BaseConnector) -> None:
        """Register a connector."""
        self._connectors[connector.connector_id] = connector
        logger.info(f"Registered connector: {connector.connector_id}")

    def get(self, connector_id: str) -> Optional[BaseConnector]:
        """Get a connector by ID."""
        return self._connectors.get(connector_id)

    def list_connectors(self) -> List[Dict[str, Any]]:
        """List all registered connectors."""
        return [
            {
                "id": c.connector_id,
                "name": c.display_name,
                "auth_type": c.auth_type,
                "connected": c.is_connected(),
            }
            for c in self._connectors.values()
        ]

    def sync_all(self) -> Dict[str, SyncStatus]:
        """Sync all connectors and return their statuses."""
        statuses = {}
        for connector_id, connector in self._connectors.items():
            try:
                list(connector.sync())  # Consume the iterator
                statuses[connector_id] = connector.sync_status()
            except Exception as exc:
                logger.error(f"Sync failed for {connector_id}: {exc}")
                statuses[connector_id] = SyncStatus(state="error", error=str(exc))
        return statuses


# ---------------------------------------------------------------------------
# Stub Connectors (ready for real implementations)
# ---------------------------------------------------------------------------

class GmailConnector(BaseConnector):
    """Gmail connector stub."""
    connector_id = "gmail"
    display_name = "Gmail"
    auth_type = "oauth"

    def is_connected(self) -> bool:
        return False

    def disconnect(self) -> None:
        pass

    def sync(self, *, since: Optional[datetime] = None, cursor: Optional[str] = None) -> Iterator[Document]:
        return iter([])

    def sync_status(self) -> SyncStatus:
        return SyncStatus()


class SlackConnector(BaseConnector):
    """Slack connector stub."""
    connector_id = "slack"
    display_name = "Slack"
    auth_type = "oauth"

    def is_connected(self) -> bool:
        return False

    def disconnect(self) -> None:
        pass

    def sync(self, *, since: Optional[datetime] = None, cursor: Optional[str] = None) -> Iterator[Document]:
        return iter([])

    def sync_status(self) -> SyncStatus:
        return SyncStatus()


class NotionConnector(BaseConnector):
    """Notion connector stub."""
    connector_id = "notion"
    display_name = "Notion"
    auth_type = "oauth"

    def is_connected(self) -> bool:
        return False

    def disconnect(self) -> None:
        pass

    def sync(self, *, since: Optional[datetime] = None, cursor: Optional[str] = None) -> Iterator[Document]:
        return iter([])

    def sync_status(self) -> SyncStatus:
        return SyncStatus()


class GitHubConnector(BaseConnector):
    """GitHub connector stub."""
    connector_id = "github"
    display_name = "GitHub"
    auth_type = "oauth"

    def is_connected(self) -> bool:
        return False

    def disconnect(self) -> None:
        pass

    def sync(self, *, since: Optional[datetime] = None, cursor: Optional[str] = None) -> Iterator[Document]:
        return iter([])

    def sync_status(self) -> SyncStatus:
        return SyncStatus()


class DropboxConnector(BaseConnector):
    """Dropbox connector stub."""
    connector_id = "dropbox"
    display_name = "Dropbox"
    auth_type = "oauth"

    def is_connected(self) -> bool:
        return False

    def disconnect(self) -> None:
        pass

    def sync(self, *, since: Optional[datetime] = None, cursor: Optional[str] = None) -> Iterator[Document]:
        return iter([])

    def sync_status(self) -> SyncStatus:
        return SyncStatus()


class SpotifyConnector(BaseConnector):
    """Spotify connector stub."""
    connector_id = "spotify"
    display_name = "Spotify"
    auth_type = "oauth"

    def is_connected(self) -> bool:
        return False

    def disconnect(self) -> None:
        pass

    def sync(self, *, since: Optional[datetime] = None, cursor: Optional[str] = None) -> Iterator[Document]:
        return iter([])

    def sync_status(self) -> SyncStatus:
        return SyncStatus()


class WeatherConnector(BaseConnector):
    """Weather connector stub."""
    connector_id = "weather"
    display_name = "Weather"
    auth_type = "local"

    def is_connected(self) -> bool:
        return True

    def disconnect(self) -> None:
        pass

    def sync(self, *, since: Optional[datetime] = None, cursor: Optional[str] = None) -> Iterator[Document]:
        return iter([])

    def sync_status(self) -> SyncStatus:
        return SyncStatus()


# ---------------------------------------------------------------------------
# Connector Manager
# ---------------------------------------------------------------------------

class ConnectorManager:
    """Manages all connectors and provides MCP tool integration."""

    def __init__(self):
        self.registry = ConnectorRegistry()
        self._register_default_connectors()

    def _register_default_connectors(self) -> None:
        """Register all available connectors."""
        connectors = [
            GmailConnector(),
            SlackConnector(),
            NotionConnector(),
            GitHubConnector(),
            DropboxConnector(),
            SpotifyConnector(),
            WeatherConnector(),
        ]
        for connector in connectors:
            self.registry.register(connector)

    def get_connector_tools(self) -> List[Dict[str, Any]]:
        """Get all MCP tool specs from all connectors."""
        tools = []
        for connector in self.registry._connectors.values():
            tools.extend(connector.mcp_tools())
        return tools

    def get_status(self) -> Dict[str, Any]:
        """Get status of all connectors."""
        return {
            "connectors": self.registry.list_connectors(),
            "total": len(self.registry._connectors),
        }


# ---------------------------------------------------------------------------
# Export
# ---------------------------------------------------------------------------

__all__ = [
    "Attachment",
    "Document",
    "SyncStatus",
    "BaseConnector",
    "ConnectorRegistry",
    "ConnectorManager",
    "GmailConnector",
    "SlackConnector",
    "NotionConnector",
    "GitHubConnector",
    "DropboxConnector",
    "SpotifyConnector",
    "WeatherConnector",
]