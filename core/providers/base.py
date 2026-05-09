"""
BaseProvider – abstract class for all LLM provider implementations.
Provides common utilities: model listing, chat completion, health checks,
proxy handling and failure recording with self-evolution capabilities.
"""

import abc
import json
import logging
import time
from typing import List, Dict, Any, Optional

import core.memory as memory  # Fixed import for memory package
# ProxyManager will be imported lazily to avoid circular imports

logger = logging.getLogger(__name__)

class ProviderError(Exception):
    """Base exception for provider errors."""
    pass

class ModelNotFoundError(ProviderError):
    """Raised when a requested model is not available."""
    pass

class BaseProvider(abc.ABC):
    """Abstract base class for all LLM providers.

    Sub‑classes must implement ``list_models`` and ``chat_completion``.
    """

    def __init__(self, config: Dict[str, Any]):
        self.name = config.get("name", self.__class__.__name__)
        self.api_key = config.get("api_key")
        self.endpoint = config.get("endpoint")
        self.requires_proxy = config.get("requires_proxy", False)
        from core.providers.proxy_manager import ProxyManager
        self.proxy_manager = ProxyManager()
        self.session = None  # placeholder for HTTP client/session
        self._init_session()
        
        # Self-evolution attributes
        self.failure_count = 0
        self.success_count = 0
        self.last_failure_time = 0
        self.last_success_time = 0
        self.performance_score = 1.0  # Start with perfect score
        self.is_temporarily_disabled = False
        self.disabled_until = 0
        self.failure_patterns = {}  # Track failure types and frequencies

    def _init_session(self):
        """Initialize HTTP session, applying proxy if needed."""
        import requests
        self.session = requests.Session()
        if self.requires_proxy:
            proxy = self.proxy_manager.get_proxy_for_provider(self.name)
            if proxy:
                self.session.proxies.update(proxy)
                logger.debug("Proxy applied for provider %s: %s", self.name, proxy)

    @abc.abstractmethod
    def list_models(self) -> List[str]:
        """Return a list of model identifiers supported by this provider."""
        raise NotImplementedError

    @abc.abstractmethod
    def chat_completion(self, model: str, messages: List[Dict[str, str]], **kwargs) -> Dict[str, Any]:
        """Perform a chat completion request.

        Returns a dict mirroring OpenAI's response format for compatibility.
        """
        raise NotImplementedError

    def health_check(self) -> bool:
        """Simple health check – can be overridden for provider‑specific logic."""
        try:
            # Default implementation: attempt to list models (cached fallback)
            self.list_models()
            return True
        except Exception as exc:  # pragma: no cover – defensive
            logger.warning("Health check failed for %s: %s", self.name, exc)
            self._record_failure(exc, "health_check")
            return False

    def record_failure(self, error: Exception, context: str = "chat_completion") -> None:
        """Record a failure in the self‑evolution memory system.

        The memory system can later suggest mitigations such as proxy switches
        or temporary disabling of the provider.
        """
        self._record_failure(error, context)

    def record_success(self, context: str = "chat_completion") -> None:
        """Record a successful interaction."""
        self.success_count += 1
        self.last_success_time = time.time()
        self._update_performance_score()
        
        # Log success to memory system
        try:
            success_record = {
                "provider": self.name,
                "context": context,
                "timestamp": self.last_success_time,
                "performance_score": self.performance_score
            }
            memory.log_success(success_record)  # type: ignore[attr-defined]
        except Exception:  # pragma: no cover – memory may be optional during early init
            logger.debug("Memory logging unavailable for success.")

    def _record_failure(self, error: Exception, context: str = "chat_completion") -> None:
        """Internal method to record failure with self-evolution logic."""
        self.failure_count += 1
        self.last_failure_time = time.time()
        error_type = type(error).__name__
        error_message = str(error)
        
        # Track failure patterns
        if error_type not in self.failure_patterns:
            self.failure_patterns[error_type] = 0
        self.failure_patterns[error_type] += 1
        
        # Update performance score
        self._update_performance_score()
        
        # Check if we should temporarily disable this provider
        self._check_temporary_disable()
        
        # Record failure in memory system
        failure_record = {
            "provider": self.name,
            "error_type": error_type,
            "error_message": error_message,
            "context": context,
            "timestamp": self.last_failure_time,
            "failure_count": self.failure_count,
            "performance_score": self.performance_score
        }
        try:
            memory.log_failure(failure_record)  # type: ignore[attr-defined]
        except Exception:  # pragma: no cover – memory may be optional during early init
            logger.debug("Memory logging unavailable, storing locally.")
            # Fallback: write to a local JSON log
            with open("core/system/provider_failures.log", "a", encoding="utf-8") as f:
                f.write(json.dumps(failure_record) + "\n")
        
        logger.warning("Recorded failure for %s (%s): %s", self.name, error_type, error_message)

    def _update_performance_score(self) -> None:
        """Update performance score based on success/failure ratio."""
        total_requests = self.success_count + self.failure_count
        if total_requests > 0:
            # Simple success rate calculation with exponential smoothing
            success_rate = self.success_count / total_requests
            # Apply exponential smoothing to prevent drastic changes
            self.performance_score = (self.performance_score * 0.7) + (success_rate * 0.3)
        else:
            self.performance_score = 1.0

    def _check_temporary_disable(self) -> None:
        """Check if provider should be temporarily disabled based on failure patterns."""
        # Disable if failure rate is too high in recent requests
        if self.failure_count >= 5 and self.performance_score < 0.3:
            # Disable for 5 minutes initially, increasing with repeated failures
            base_disable_time = 300  # 5 minutes
            disable_multiplier = min(self.failure_count // 5, 10)  # Cap at 10x
            disable_duration = base_disable_time * disable_multiplier
            
            self.is_temporarily_disabled = True
            self.disabled_until = time.time() + disable_duration
            logger.warning("Provider %s temporarily disabled for %d seconds due to high failure rate", 
                         self.name, disable_duration)
        
        # Re-enable if disable period has passed
        if self.is_temporarily_disabled and time.time() >= self.disabled_until:
            self.is_temporarily_disabled = False
            self.disabled_until = 0
            logger.info("Provider %s re-enabled after temporary disable period", self.name)

    def is_available(self) -> bool:
        """Check if provider is available for use (not temporarily disabled)."""
        return not self.is_temporarily_disabled

    def get_provider_stats(self) -> Dict[str, Any]:
        """Get provider statistics for self-evolution system."""
        return {
            "name": self.name,
            "success_count": self.success_count,
            "failure_count": self.failure_count,
            "performance_score": self.performance_score,
            "is_available": self.is_available(),
            "is_temporarily_disabled": self.is_temporarily_disabled,
            "disabled_until": self.disabled_until,
            "failure_patterns": self.failure_patterns,
            "last_failure_time": self.last_failure_time,
            "last_success_time": self.last_success_time
        }

    # Helper utilities -----------------------------------------------------
    def _request_with_retry(self, method: str, url: str, **kwargs) -> Any:
        """Execute an HTTP request with exponential back‑off and rate‑limit handling.
        """
        max_retries = 5
        backoff = 1.0
        for attempt in range(max_retries):
            try:
                response = self.session.request(method, url, **kwargs)
                response.raise_for_status()
                self.record_success("_request_with_retry")
                return response.json()
            except Exception as exc:
                self.record_failure(exc, "_request_with_retry")
                if attempt == max_retries - 1:
                    raise ProviderError(f"Request failed after {max_retries} attempts: {exc}")
                time.sleep(backoff)
                backoff *= 2
        raise ProviderError("Unreachable code in _request_with_retry")
