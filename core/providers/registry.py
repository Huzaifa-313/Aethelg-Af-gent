"""
ProviderManager – central registry that discovers, loads, and manages all providers.
Handles caching of model lists, routing of chat requests, and integration with the orchestrator.
"""

import json
import logging
import os
from pathlib import Path
from typing import Dict, List, Optional

from .base import BaseProvider, ProviderError, ModelNotFoundError
from .proxy_manager import ProxyManager

logger = logging.getLogger(__name__)

class ProviderManager:
    """Singleton-like manager for all providers."""

    _instance = None
    _providers: Dict[str, BaseProvider] = {}
    _config_path = Path("core/providers/config.yaml")
    _model_cache_path = Path("core/providers/models_cache.json")
    _default_provider: Optional[str] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._load_config()
            cls._instance._load_model_cache()
        return cls._instance

    # --------------------------------------------------------------------- #
    # Configuration & Cache Management
    # --------------------------------------------------------------------- #
    def _load_config(self) -> None:
        """Load provider configuration from config.yaml."""
        import yaml
        if not self._config_path.exists():
            logger.warning("Config file %s not found; using defaults.", self._config_path)
            return
        try:
            with open(self._config_path, "r", encoding="utf-8") as f:
                self._config = yaml.safe_load(f) or {}
        except Exception as exc:
            logger.error("Failed to parse %s: %s", self._config_path, exc)
            self._config = {}

        # Register providers defined in config
        for provider_name, provider_cfg in self._config.get("providers", {}).items():
            self.register_provider(provider_name, provider_cfg)

    def _load_model_cache(self) -> None:
        """Load or initialize model cache; refresh if missing."""
        if self._model_cache_path.exists():
            try:
                with open(self._model_cache_path, "r", encoding="utf-8") as f:
                    self._model_cache = json.load(f)
            except Exception as exc:
                logger.error("Failed to read model cache: %s", exc)
                self._model_cache = {}
        else:
            self._model_cache = {}

    def _save_model_cache(self) -> None:
        """Persist model cache to disk."""
        try:
            with open(self._model_cache_path, "w", encoding="utf-8") as f:
                json.dump(self._model_cache, f, indent=2)
        except Exception as exc:
            logger.error("Failed to write model cache: %s", exc)

    # --------------------------------------------------------------------- #
    # Provider Registration
    # --------------------------------------------------------------------- #
    def register_provider(self, name: str, config: Dict) -> None:
        """Register a provider implementation with the manager."""
        provider_class_path = config.get("class")
        if not provider_class_path:
            logger.error("Provider %s missing required 'class' entry in config.", name)
            return

        try:
            module_path, class_name = provider_class_path.rsplit(".", 1)
            provider_cls = __import__(module_path, fromlist=[class_name]).__getattr__(class_name)
            provider = provider_cls(config)
            self._providers[name] = provider
            logger.info("Registered provider %s (%s)", name, provider_class_path)
        except Exception as exc:
            logger.error("Failed to register provider %s: %s", name, exc)

    def get_provider(self, name: str) -> BaseProvider:
        """Retrieve a registered provider instance."""
        provider = self._providers.get(name)
        if not provider:
            raise ProviderError(f"Provider '{name}' is not registered.")
        return provider

    def list_providers(self) -> List[str]:
        """Return a list of all registered provider names."""
        return list(self._providers.keys())

    # --------------------------------------------------------------------- #
    # Model Discovery & Caching
    # --------------------------------------------------------------------- #
    def get_all_models(self) -> List[str]:
        """Return a flat list of 'provider/model' strings for all cached models."""
        models = []
        for name, provider in self._providers.items():
            try:
                provider_models = provider.list_models()
                for model in provider_models:
                    models.append(f"{name}/{model}")
            except Exception as exc:
                logger.warning("Failed to list models for %s: %s", name, exc)
        # Merge with cached models that may not be currently registered
        for alias, model_list in self._model_cache.items():
            models.extend([f"{alias}/{m}" for m in model_list])
        return models

    def get_model_details(self, model_ref: str) -> Dict[str, str]:
        """Parse a 'provider/model' string into its components."""
        if "/" not in model_ref:
            raise ModelNotFoundError("Invalid model reference format.")
        provider, model = model_ref.split("/", 1)
        return {"provider": provider, "model": model}

    # --------------------------------------------------------------------- #
    # Routing & Chat
    # --------------------------------------------------------------------- #
    def route_by_requirements(self, task_description: str) -> str:
        """Simple routing logic – can be replaced with a Router Agent later."""
        # Placeholder: always pick the first available provider for now.
        # In a full implementation, a dedicated Router Agent would analyze task_description.
        providers = self.list_providers()
        return providers[0] if providers else ""

    def chat(self, model_ref: str, messages: List[Dict], **kwargs) -> Dict:
        """Dispatch a chat request to the appropriate provider."""
        try:
            provider_name, model_name = self.get_model_details(model_ref)
        except ModelNotFoundError:
            raise ProviderError(f"Invalid model reference: {model_ref}")

        provider = self.get_provider(provider_name)
        try:
            return provider.chat_completion(model_name, messages, **kwargs)
        except ProviderError as exc:
            logger.warning("Provider %s failed for model %s: %s", provider_name, model_name, exc)
            # Record failure for self‑evolution
            provider.record_failure(exc)
            raise

    # --------------------------------------------------------------------- #
    # Health & Fallback
    # --------------------------------------------------------------------- #
    def health_check(self) -> Dict[str, bool]:
        """Run health checks on all providers; return a dict of results."""
        health = {}
        for name, provider in self._providers.items():
            health[name] = provider.health_check()
        return health

    def fallback_provider(self, failed_provider: str) -> Optional[str]:
        """Return the next best provider after a failure, if configured."""
        providers = self.list_providers()
        if not providers:
            return None
        try:
            idx = providers.index(failed_provider)
            return providers[(idx + 1) % len(providers)]
        except ValueError:
            return providers[0] if providers else None


def get_provider_manager() -> ProviderManager:
    """Return the singleton ProviderManager instance."""
    return ProviderManager()