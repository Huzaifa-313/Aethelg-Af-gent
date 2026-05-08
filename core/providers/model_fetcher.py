"""
ModelFetcher – fetches live model lists from provider APIs and caches them.
Supports automatic retry, fallback to local cached lists, and integration
with the GitHub hunter for weekly model list updates.
"""

import json
import logging
import time
from pathlib import Path
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

CACHE_FILE = Path("core/providers/models_cache.json")
FETCH_INTERVAL_HOURS = 24

class ModelFetcher:
    """Fetches and caches model lists from provider APIs."""

    def __init__(self):
        self._cache = self._load_cache()
        self._last_fetch = self._cache.get("last_fetch", 0)

    def _load_cache(self) -> Dict:
        """Load model cache from disk."""
        if CACHE_FILE.exists():
            try:
                with open(CACHE_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as exc:
                logger.error("Failed to load model cache: %s", exc)
        return {}

    def _save_cache(self, data: Dict) -> None:
        """Persist cache to disk."""
        try:
            with open(CACHE_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as exc:
            logger.error("Failed to save model cache: %s", exc)

    def should_refresh(self) -> bool:
        """Return True if the cache is older than the fetch interval."""
        return (time.time() - self._last_fetch) > (FETCH_INTERVAL_HOURS * 3600)

    def fetch_models(self, provider_name: str, provider_instance) -> List[str]:
        """Fetch model list from a provider; fall back to cached list."""
        if not self.should_refresh():
            cached = self._cache.get("providers", {}).get(provider_name)
            if cached:
                logger.debug("Using cached model list for %s", provider_name)
                return cached

        try:
            models = provider_instance.list_models()
            self._update_cache(provider_name, models)
            return models
        except Exception as exc:
            logger.warning("Live fetch failed for %s: %s", provider_name, exc)
            # Fall back to cached list
            cached = self._cache.get("providers", {}).get(provider_name, [])
            logger.debug("Falling back to cached list for %s (%d models)", provider_name, len(cached))
            return cached

    def _update_cache(self, provider_name: str, models: List[str]) -> None:
        """Update cache with fresh model list."""
        self._cache.setdefault("providers", {})
        self._cache["providers"][provider_name] = models
        self._cache["last_fetch"] = time.time()
        self._save_cache(self._cache)
        logger.info("Updated model cache for %s: %d models", provider_name, len(models))

    def refresh_all(self, providers: Dict) -> None:
        """Refresh model lists for all registered providers."""
        for name, provider in providers.items():
            self.fetch_models(name, provider)

    def trigger_hunter_refresh(self) -> None:
        """Trigger GitHub hunter to search for new provider model lists."""
        logger.info("Triggering GitHub hunter for model list refresh")
        try:
            from core.hunter import hunter
            hunter.search_and_install(
                query="provider-models-list-2025",
                tags=["llm", "model-list"]
            )
        except Exception as exc:
            logger.error("Hunter refresh failed: %s", exc)
