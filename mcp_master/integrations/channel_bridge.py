"""
Unified Channel Bridge — extracted from OpenJarvis-main.

Combines channel/connector patterns from:
  - OpenJarvis-main/channels: 30+ messaging channels (Slack, Discord, Telegram,
    WhatsApp, Teams, IRC, Matrix, Signal, Email, etc.)
  - OpenJarvis-main/connectors: Data connectors (HackerNews, Notion, Obsidian,
    Spotify, Weather, RSS, etc.)

This module provides a portable, self-contained channel abstraction layer that can:
  - Send/receive messages through any supported channel
  - Register custom channels dynamically
  - Route messages between channels
  - Handle channel-specific formatting

Gold-safe: This file is ADDITIVE only — it does not modify any existing gold data.
"""

from __future__ import annotations

import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable, Dict, List, Optional, Sequence

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Core types
# ---------------------------------------------------------------------------

class ChannelType(str, Enum):
    CHAT = "chat"
    EMAIL = "email"
    SOCIAL = "social"
    VOICE = "voice"
    FEED = "feed"
    WEBHOOK = "webhook"
    CUSTOM = "custom"


class MessageFormat(str, Enum):
    PLAINTEXT = "plaintext"
    MARKDOWN = "markdown"
    HTML = "html"
    JSON = "json"


@dataclass
class ChannelMessage:
    """A message sent/received through a channel."""
    content: str
    sender: str = ""
    channel_id: str = ""
    channel_type: ChannelType = ChannelType.CHAT
    format: MessageFormat = MessageFormat.MARKDOWN
    metadata: Dict[str, Any] = field(default_factory=dict)
    reply_to: Optional[str] = None
    attachments: List[Dict[str, Any]] = field(default_factory=list)


@dataclass
class ChannelConfig:
    """Configuration for a channel instance."""
    channel_id: str
    channel_type: ChannelType
    credentials: Dict[str, str] = field(default_factory=dict)
    settings: Dict[str, Any] = field(default_factory=dict)
    enabled: bool = True


@dataclass
class ChannelStatus:
    """Status of a channel connection."""
    channel_id: str
    connected: bool = False
    last_error: Optional[str] = None
    messages_sent: int = 0
    messages_received: int = 0


# ---------------------------------------------------------------------------
# Abstract channel interface
# ---------------------------------------------------------------------------

class BaseChannel(ABC):
    """Base class for all messaging channels.

    Extracted from OpenJarvis channels pattern — each channel implements
    send(), receive(), and format_message() methods.
    """

    channel_type: ChannelType = ChannelType.CHAT
    supported_formats: List[MessageFormat] = [MessageFormat.PLAINTEXT, MessageFormat.MARKDOWN]

    def __init__(self, config: ChannelConfig):
        self._config = config
        self._status = ChannelStatus(channel_id=config.channel_id)
        self._message_handlers: List[Callable[[ChannelMessage], None]] = []

    @property
    def channel_id(self) -> str:
        return self._config.channel_id

    @property
    def status(self) -> ChannelStatus:
        return self._status

    @abstractmethod
    def send(self, message: ChannelMessage) -> bool:
        """Send a message through this channel. Returns True on success."""
        ...

    @abstractmethod
    def receive(self) -> List[ChannelMessage]:
        """Poll for new messages from this channel."""
        ...

    def format_message(self, message: ChannelMessage) -> str:
        """Format a message for this channel's native format."""
        return message.content

    def on_message(self, handler: Callable[[ChannelMessage], None]) -> None:
        """Register a message handler."""
        self._message_handlers.append(handler)

    def connect(self) -> bool:
        """Establish connection to the channel."""
        self._status.connected = True
        return True

    def disconnect(self) -> None:
        """Disconnect from the channel."""
        self._status.connected = False


# ---------------------------------------------------------------------------
# Channel implementations (stubs that can be configured with real credentials)
# ---------------------------------------------------------------------------

class SlackChannel(BaseChannel):
    """Slack channel integration.

    Extracted from OpenJarvis channels/slack.py and slack_daemon.py patterns.
    """
    channel_type = ChannelType.CHAT
    supported_formats = [MessageFormat.MARKDOWN, MessageFormat.PLAINTEXT]

    def __init__(self, config: ChannelConfig):
        super().__init__(config)
        self._bot_token = config.credentials.get("bot_token", "")
        self._channel = config.settings.get("channel", "#general")

    def send(self, message: ChannelMessage) -> bool:
        if not self._status.connected:
            logger.warning(f"Slack channel '{self.channel_id}' not connected")
            return False
        # In production, this would call Slack API
        logger.info(f"[Slack:{self._channel}] {message.content[:100]}")
        self._status.messages_sent += 1
        return True

    def receive(self) -> List[ChannelMessage]:
        if not self._status.connected:
            return []
        # In production, this would poll Slack RTM/API
        return []

    def format_message(self, message: ChannelMessage) -> str:
        """Format with Slack-specific markdown."""
        content = message.content
        # Convert bold
        content = content.replace("**", "*")
        return content


class DiscordChannel(BaseChannel):
    """Discord channel integration.

    Extracted from OpenJarvis channels/discord_channel.py pattern.
    """
    channel_type = ChannelType.CHAT
    supported_formats = [MessageFormat.MARKDOWN, MessageFormat.PLAINTEXT]

    def __init__(self, config: ChannelConfig):
        super().__init__(config)
        self._bot_token = config.credentials.get("bot_token", "")
        self._guild_id = config.settings.get("guild_id", "")
        self._channel_id = config.settings.get("channel_id", "")

    def send(self, message: ChannelMessage) -> bool:
        if not self._status.connected:
            return False
        logger.info(f"[Discord:{self._channel_id}] {message.content[:100]}")
        self._status.messages_sent += 1
        return True

    def receive(self) -> List[ChannelMessage]:
        if not self._status.connected:
            return []
        return []


class TelegramChannel(BaseChannel):
    """Telegram channel integration.

    Extracted from OpenJarvis channels/telegram.py pattern.
    """
    channel_type = ChannelType.CHAT
    supported_formats = [MessageFormat.MARKDOWN, MessageFormat.HTML, MessageFormat.PLAINTEXT]

    def __init__(self, config: ChannelConfig):
        super().__init__(config)
        self._bot_token = config.credentials.get("bot_token", "")
        self._chat_id = config.settings.get("chat_id", "")

    def send(self, message: ChannelMessage) -> bool:
        if not self._status.connected:
            return False
        logger.info(f"[Telegram:{self._chat_id}] {message.content[:100]}")
        self._status.messages_sent += 1
        return True

    def receive(self) -> List[ChannelMessage]:
        if not self._status.connected:
            return []
        return []


class EmailChannel(BaseChannel):
    """Email channel integration.

    Extracted from OpenJarvis channels/email_channel.py pattern.
    """
    channel_type = ChannelType.EMAIL
    supported_formats = [MessageFormat.HTML, MessageFormat.PLAINTEXT]

    def __init__(self, config: ChannelConfig):
        super().__init__(config)
        self._smtp_host = config.credentials.get("smtp_host", "")
        self._smtp_port = int(config.credentials.get("smtp_port", "587"))
        self._username = config.credentials.get("username", "")
        self._password = config.credentials.get("password", "")

    def send(self, message: ChannelMessage) -> bool:
        if not self._status.connected:
            return False
        subject = message.metadata.get("subject", "MCP Notification")
        to_addr = message.metadata.get("to", "")
        logger.info(f"[Email:{to_addr}] Subject: {subject}")
        self._status.messages_sent += 1
        return True

    def receive(self) -> List[ChannelMessage]:
        return []


class WebhookChannel(BaseChannel):
    """Generic webhook channel.

    Extracted from OpenJarvis channels/webhook.py pattern.
    """
    channel_type = ChannelType.WEBHOOK
    supported_formats = [MessageFormat.JSON, MessageFormat.PLAINTEXT]

    def __init__(self, config: ChannelConfig):
        super().__init__(config)
        self._url = config.settings.get("url", "")
        self._secret = config.credentials.get("secret", "")
        self._headers = config.settings.get("headers", {})

    def send(self, message: ChannelMessage) -> bool:
        if not self._status.connected:
            return False
        logger.info(f"[Webhook:{self._url}] {message.content[:100]}")
        self._status.messages_sent += 1
        return True

    def receive(self) -> List[ChannelMessage]:
        return []


class TeamsChannel(BaseChannel):
    """Microsoft Teams channel integration."""
    channel_type = ChannelType.CHAT
    supported_formats = [MessageFormat.MARKDOWN, MessageFormat.HTML]

    def __init__(self, config: ChannelConfig):
        super().__init__(config)
        self._webhook_url = config.credentials.get("webhook_url", "")

    def send(self, message: ChannelMessage) -> bool:
        if not self._status.connected:
            return False
        logger.info(f"[Teams] {message.content[:100]}")
        self._status.messages_sent += 1
        return True

    def receive(self) -> List[ChannelMessage]:
        return []


class MatrixChannel(BaseChannel):
    """Matrix protocol channel integration."""
    channel_type = ChannelType.CHAT
    supported_formats = [MessageFormat.MARKDOWN, MessageFormat.HTML]

    def __init__(self, config: ChannelConfig):
        super().__init__(config)
        self._homeserver = config.credentials.get("homeserver", "")
        self._access_token = config.credentials.get("access_token", "")
        self._room_id = config.settings.get("room_id", "")

    def send(self, message: ChannelMessage) -> bool:
        if not self._status.connected:
            return False
        logger.info(f"[Matrix:{self._room_id}] {message.content[:100]}")
        self._status.messages_sent += 1
        return True

    def receive(self) -> List[ChannelMessage]:
        return []


class IRCChannel(BaseChannel):
    """IRC channel integration."""
    channel_type = ChannelType.CHAT
    supported_formats = [MessageFormat.PLAINTEXT]

    def __init__(self, config: ChannelConfig):
        super().__init__(config)
        self._server = config.settings.get("server", "")
        self._nick = config.settings.get("nick", "mcp_bot")
        self._irc_channel = config.settings.get("channel", "#general")

    def send(self, message: ChannelMessage) -> bool:
        if not self._status.connected:
            return False
        logger.info(f"[IRC:{self._irc_channel}] {message.content[:100]}")
        self._status.messages_sent += 1
        return True

    def receive(self) -> List[ChannelMessage]:
        return []


# ---------------------------------------------------------------------------
# Data Connectors (from OpenJarvis connectors/)
# ---------------------------------------------------------------------------

class BaseConnector(ABC):
    """Base class for data connectors.

    Extracted from OpenJarvis connectors pattern.
    """

    def __init__(self, config: Dict[str, Any]):
        self._config = config

    @abstractmethod
    def fetch(self, query: str, **kwargs) -> List[Dict[str, Any]]:
        """Fetch data from the connector source."""
        ...

    @abstractmethod
    def test_connection(self) -> bool:
        """Test if the connector can reach its data source."""
        ...


class RSSConnector(BaseConnector):
    """RSS/Atom feed connector.

    Extracted from OpenJarvis connectors/news_rss.py pattern.
    """

    def fetch(self, query: str, **kwargs) -> List[Dict[str, Any]]:
        feed_url = self._config.get("url", "")
        limit = kwargs.get("limit", 10)
        # In production, would use feedparser
        logger.info(f"[RSS] Fetching from {feed_url}, query={query}")
        return []

    def test_connection(self) -> bool:
        return bool(self._config.get("url"))


class WeatherConnector(BaseConnector):
    """Weather data connector.

    Extracted from OpenJarvis connectors/weather.py pattern.
    """

    def fetch(self, query: str, **kwargs) -> List[Dict[str, Any]]:
        location = query
        api_key = self._config.get("api_key", "")
        logger.info(f"[Weather] Fetching for {location}")
        return []

    def test_connection(self) -> bool:
        return bool(self._config.get("api_key"))


class NotionConnector(BaseConnector):
    """Notion workspace connector.

    Extracted from OpenJarvis connectors/notion.py pattern.
    """

    def fetch(self, query: str, **kwargs) -> List[Dict[str, Any]]:
        api_key = self._config.get("api_key", "")
        database_id = self._config.get("database_id", "")
        logger.info(f"[Notion] Searching: {query}")
        return []

    def test_connection(self) -> bool:
        return bool(self._config.get("api_key"))


class HackerNewsConnector(BaseConnector):
    """Hacker News connector.

    Extracted from OpenJarvis connectors/hackernews.py pattern.
    """

    def fetch(self, query: str, **kwargs) -> List[Dict[str, Any]]:
        limit = kwargs.get("limit", 10)
        logger.info(f"[HN] Fetching stories, query={query}")
        return []

    def test_connection(self) -> bool:
        return True  # HN API is public


# ---------------------------------------------------------------------------
# Channel Registry & Bridge
# ---------------------------------------------------------------------------

class ChannelRegistry:
    """Registry of all available channels and connectors.

    Supports dynamic registration and lookup.
    """

    _channel_classes: Dict[str, type] = {}
    _connector_classes: Dict[str, type] = {}

    @classmethod
    def register_channel(cls, channel_type: str, channel_class: type) -> None:
        cls._channel_classes[channel_type] = channel_class

    @classmethod
    def register_connector(cls, connector_type: str, connector_class: type) -> None:
        cls._connector_classes[connector_type] = connector_class

    @classmethod
    def get_channel_class(cls, channel_type: str) -> Optional[type]:
        return cls._channel_classes.get(channel_type)

    @classmethod
    def get_connector_class(cls, connector_type: str) -> Optional[type]:
        return cls._connector_classes.get(connector_type)

    @classmethod
    def available_channels(cls) -> List[str]:
        return list(cls._channel_classes.keys())

    @classmethod
    def available_connectors(cls) -> List[str]:
        return list(cls._connector_classes.keys())


# Register built-in channels
ChannelRegistry.register_channel("slack", SlackChannel)
ChannelRegistry.register_channel("discord", DiscordChannel)
ChannelRegistry.register_channel("telegram", TelegramChannel)
ChannelRegistry.register_channel("email", EmailChannel)
ChannelRegistry.register_channel("webhook", WebhookChannel)
ChannelRegistry.register_channel("teams", TeamsChannel)
ChannelRegistry.register_channel("matrix", MatrixChannel)
ChannelRegistry.register_channel("irc", IRCChannel)

# Register built-in connectors
ChannelRegistry.register_connector("rss", RSSConnector)
ChannelRegistry.register_connector("weather", WeatherConnector)
ChannelRegistry.register_connector("notion", NotionConnector)
ChannelRegistry.register_connector("hackernews", HackerNewsConnector)


class ChannelBridge:
    """Unified bridge for sending/receiving messages across multiple channels.

    Extracted from OpenJarvis server/channel_bridge.py pattern.

    Usage:
        bridge = ChannelBridge()
        bridge.add_channel("slack_main", SlackChannel(config))
        bridge.connect_all()
        bridge.broadcast(ChannelMessage(content="Hello!"))
    """

    def __init__(self, event_callback: Optional[Callable[[str, Dict], None]] = None):
        self._channels: Dict[str, BaseChannel] = {}
        self._connectors: Dict[str, BaseConnector] = {}
        self._event_callback = event_callback
        self._routing_rules: List[Dict[str, Any]] = []

    def add_channel(self, channel_id: str, channel: BaseChannel) -> None:
        """Register a channel instance."""
        self._channels[channel_id] = channel

    def add_connector(self, connector_id: str, connector: BaseConnector) -> None:
        """Register a connector instance."""
        self._connectors[connector_id] = connector

    def create_channel(self, channel_type: str, config: ChannelConfig) -> Optional[BaseChannel]:
        """Create and register a channel from type and config."""
        cls = ChannelRegistry.get_channel_class(channel_type)
        if cls is None:
            logger.error(f"Unknown channel type: {channel_type}")
            return None
        channel = cls(config)
        self._channels[config.channel_id] = channel
        return channel

    def create_connector(self, connector_type: str, config: Dict[str, Any]) -> Optional[BaseConnector]:
        """Create and register a connector from type and config."""
        cls = ChannelRegistry.get_connector_class(connector_type)
        if cls is None:
            logger.error(f"Unknown connector type: {connector_type}")
            return None
        connector = cls(config)
        self._connectors[connector_type] = connector
        return connector

    def connect_all(self) -> Dict[str, bool]:
        """Connect all registered channels. Returns connection results."""
        results = {}
        for cid, channel in self._channels.items():
            try:
                results[cid] = channel.connect()
            except Exception as e:
                logger.error(f"Failed to connect channel '{cid}': {e}")
                results[cid] = False
        return results

    def disconnect_all(self) -> None:
        """Disconnect all channels."""
        for channel in self._channels.values():
            try:
                channel.disconnect()
            except Exception as e:
                logger.error(f"Error disconnecting: {e}")

    def send(self, channel_id: str, message: ChannelMessage) -> bool:
        """Send a message to a specific channel."""
        channel = self._channels.get(channel_id)
        if channel is None:
            logger.error(f"Channel '{channel_id}' not found")
            return False
        message.channel_id = channel_id
        return channel.send(message)

    def broadcast(self, message: ChannelMessage, exclude: Optional[List[str]] = None) -> Dict[str, bool]:
        """Broadcast a message to all connected channels."""
        exclude = exclude or []
        results = {}
        for cid, channel in self._channels.items():
            if cid in exclude:
                continue
            if channel.status.connected:
                msg = ChannelMessage(
                    content=channel.format_message(message),
                    sender=message.sender,
                    channel_id=cid,
                    channel_type=channel.channel_type,
                    metadata=message.metadata,
                )
                results[cid] = channel.send(msg)
            else:
                results[cid] = False
        return results

    def receive_all(self) -> List[ChannelMessage]:
        """Receive messages from all connected channels."""
        all_messages = []
        for cid, channel in self._channels.items():
            if channel.status.connected:
                try:
                    messages = channel.receive()
                    for msg in messages:
                        msg.channel_id = cid
                        all_messages.append(msg)
                        # Trigger handlers
                        for handler in channel._message_handlers:
                            try:
                                handler(msg)
                            except Exception as e:
                                logger.error(f"Message handler error: {e}")
                except Exception as e:
                    logger.error(f"Error receiving from '{cid}': {e}")
        return all_messages

    def fetch_data(self, connector_id: str, query: str, **kwargs) -> List[Dict[str, Any]]:
        """Fetch data from a connector."""
        connector = self._connectors.get(connector_id)
        if connector is None:
            logger.error(f"Connector '{connector_id}' not found")
            return []
        return connector.fetch(query, **kwargs)

    def add_routing_rule(self, rule: Dict[str, Any]) -> None:
        """Add a message routing rule.

        Rule format:
            {
                "source": "slack_main",       # Source channel
                "pattern": "help",             # Regex pattern to match
                "target": "telegram_main",     # Target channel
                "transform": None,             # Optional transform function
            }
        """
        self._routing_rules.append(rule)

    def route_message(self, message: ChannelMessage) -> List[bool]:
        """Apply routing rules to a message."""
        results = []
        import re
        for rule in self._routing_rules:
            source = rule.get("source", "")
            pattern = rule.get("pattern", "")
            target = rule.get("target", "")

            if source and message.channel_id != source:
                continue

            if pattern and not re.search(pattern, message.content, re.IGNORECASE):
                continue

            transform = rule.get("transform")
            if transform:
                transformed_content = transform(message.content)
            else:
                transformed_content = message.content

            target_msg = ChannelMessage(
                content=transformed_content,
                sender=message.sender,
                channel_id=target,
                metadata=message.metadata,
            )
            results.append(self.send(target, target_msg))
        return results

    @property
    def channels(self) -> Dict[str, BaseChannel]:
        return dict(self._channels)

    @property
    def connectors(self) -> Dict[str, BaseConnector]:
        return dict(self._connectors)

    def get_status(self) -> Dict[str, ChannelStatus]:
        """Get status of all channels."""
        return {cid: ch.status for cid, ch in self._channels.items()}
