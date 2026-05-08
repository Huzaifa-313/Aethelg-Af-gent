"""
Aethelgard Universal Provider Engine
Dynamically connects to 30+ LLM providers with self-expansion capabilities.
"""

from core.providers.base import BaseProvider, ProviderError, ModelNotFoundError
from core.providers.registry import ProviderManager, get_provider_manager
from core.providers.model_fetcher import ModelFetcher
from core.providers.proxy_manager import ProxyManager

__version__ = "1.0.0"

__all__ = [
    "BaseProvider",
    "ProviderError", 
    "ModelNotFoundError",
    "ProviderManager",
    "get_provider_manager",
    "ModelFetcher",
    "ProxyManager",
]
