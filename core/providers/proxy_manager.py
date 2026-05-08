"""
ProxyManager – Enhanced with Self-Evolution and Hunter-Driven Capabilities
"""

import logging
import os
import yaml
from pathlib import Path
from typing import Dict, Optional, List

from core.hunter import hunter  # Import hunter module
from core.providers.base import BaseProvider

logger = logging.getLogger(__name__)

PROXY_LIST_PATH = Path("core/providers/proxy_list.yaml")
PROXY_KEY_PATH = Path("core/system/proxy_key.key")
PROXY_LOG_PATH = Path("core/system/proxy_setup.log")

class ProxyManager:
    """Manages proxy configuration with self-evolution and hunter integration."""

    def __init__(self):
        self.proxies: Dict[str, Dict[str, str]] = {}
        self._load_proxy_list()
        self._ensure_proxy_key()
        self._initialize_hunter_integration()

    def _load_proxy_list(self) -> None:
        """Load proxy definitions from YAML file."""
        if PROXY_LIST_PATH.exists():
            try:
                with open(PROXY_LIST_PATH, "r", encoding="utf-8") as f:
                    data = yaml.safe_load(f) or {}
                self.proxies = data.get("proxies", {})
                logger.info("Loaded %d proxy entries", len(self.proxies))
            except Exception as exc:
                logger.error("Failed to load proxy list: %s", exc)
                self.proxies = {}
        else:
            logger.warning("Proxy list not found at %s, creating default.", PROXY_LIST_PATH)
            self._create_default_proxy_list()

    def _create_default_proxy_list(self) -> None:
        """Create a starter proxy_list.yaml with common configurations."""
        default = {
            "proxies": {
                "default_http": {
                    "protocol": "http",
                    "host": "proxy.example.com",
                    "port": 8080,
                    "username": "",
                    "password": "",
                },
                "default_socks5": {
                    "protocol": "socks5",
                    "host": "127.0.0.1",
                    "port": 1080,
                    "username": "",
                    "password": "",
                },
            }
        }
        PROXY_LIST_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(PROXY_LIST_PATH, "w", encoding="utf-8") as f:
            yaml.dump(default, f, default_flow_style=False)
        self.proxies = default["proxies"]

    def _ensure_proxy_key(self) -> None:
        """Generate Fernet key for encrypting proxy credentials if missing."""
        if not PROXY_KEY_PATH.exists():
            try:
                from cryptography.fernet import Fernet
                key = Fernet.generate_key()
                PROXY_KEY_PATH.parent.mkdir(parents=True, exist_ok=True)
                with open(PROXY_KEY_PATH, "wb") as f:
                    f.write(key)
                os.chmod(str(PROXY_KEY_PATH), 0o600)
                logger.info("Generated new proxy encryption key at %s", PROXY_KEY_PATH)
            except ImportError:
                logger.warning("cryptography package not installed; proxy credentials will not be encrypted.")

    def _initialize_hunter_integration(self) -> None:
        """Set up GitHub hunter for proxy discovery."""
        self.hunter = hunter()  # Initialize hunter instance

    def get_proxy_for_provider(self, provider_name: str) -> Optional[Dict[str, str]]:
        """Return a proxy dict suitable for requests library.

        Looks up provider_name in the proxy list; falls back to 'default' if not found.
        """
        proxy_config = self.proxies.get(provider_name) or self.proxies.get("default_http")
        if not proxy_config:
            return None

        # Check if proxy needs rotation or hunter intervention
        if self._should_rotate_proxy(provider_name):
            self._rotate_proxy(provider_name)

        protocol = proxy_config.get("protocol", "http")
        host = proxy_config.get("host", "127.0.0.1")
        port = proxy_config.get("port", 8080)
        username = proxy_config.get("username", "")
        password = proxy_config.get("password", "")

        # Mask password in logs
        masked_pwd = "****" if password else ""
        logger.debug(
            "Proxy for %s: %s://%s:***@%s:%s",
            provider_name, protocol, username or "<no-user>", masked_pwd, host, port
        )

        proxy_url = f"{protocol}://"
        if username and password:
            proxy_url += f"{username}:{password}@"
        elif username:
            proxy_url += f"{username}@"
        proxy_url += f"{host}:{port}"

        return {"http": proxy_url, "https": proxy_url}

    def _should_rotate_proxy(self, provider_name: str) -> bool:
        """Determine if proxy should be rotated based on failure patterns."""
        # Check provider's failure history
        provider = BaseProvider.get_provider(provider_name)
        if not provider:
            return False

        # Rotate if provider has high failure rate or specific patterns
        if provider.failure_count >= 3 or "connection_error" in provider.failure_patterns:
            return True
        return False

    def _rotate_proxy(self, provider_name: str) -> None:
        """Trigger proxy rotation using hunter or local list."""
        logger.info("Rotating proxy for %s", provider_name)
        
        # First try hunter for new proxy
        if self.trigger_hunter_for_proxy(provider_name):
            self._load_proxy_list()  # Reload after hunter updates
            return

        # Fallback to local list rotation
        current_index = list(self.proxies.keys()).index(provider_name)
        next_index = (current_index + 1) % len(self.proxies)
        self.proxies[provider_name] = self.proxies[list(self.proxies.keys())[next_index]]
        logger.info("Rotated to next proxy in list for %s", provider_name)

    def trigger_hunter_for_proxy(self, provider_name: str) -> bool:
        """Use GitHub hunter to find a new proxy setup script."""
        logger.info("Triggering GitHub hunter to find proxy for %s", provider_name)
        try:
            result = self.hunter.search_and_install(
                query=f"free {provider_name} proxy list fetcher",
                tags=["proxy", "network"]
            )
            if result and result.get("success"):
                self._load_proxy_list()  # Reload after hunter updates
                return True
        except Exception as exc:
            logger.error("Hunter proxy fetch failed: %s", exc)
        return False

    def log_proxy_setup(self, message: str) -> None:
        """Append a message to the proxy setup log."""
        PROXY_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(PROXY_LOG_PATH, "a", encoding="utf-8") as f:
            f.write(f"[{time.time()}] {message}\n")

    def get_proxy_stats(self, provider_name: str) -> Dict:
        """Get proxy usage statistics for a provider."""
        if provider_name not in self.proxies:
            return {}
        return {
            "current_proxy": self.proxies[provider_name],
            "rotation_count": self._get_rotation_count(provider_name)
        }

    def _get_rotation_count(self, provider_name: str) -> int:
        """Track how many times a provider's proxy has been rotated."""
        # This would need to be tracked in a separate log or database
        return 0  # Placeholder - implement tracking logic

    def get_proxy_health(self, provider_name: str) -> Dict:
        """Check health of current proxy for a provider."""
        proxy = self.get_proxy_for_provider(provider_name)
        if not proxy:
            return {"status": "unavailable"}
        
        # Basic health check - could be enhanced with actual proxy tests
        return {"status": "healthy" if proxy else "unhealthy"}
