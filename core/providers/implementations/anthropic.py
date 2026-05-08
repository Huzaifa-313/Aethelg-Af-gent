"""
Anthropic Provider Implementation – uses the Claude API.
"""

from core.providers.base import BaseProvider, ProviderError
import requests
from typing import List, Dict, Any

class AnthropicProvider(BaseProvider):
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.api_key = config.get("api_key")
        self.endpoint = config.get("endpoint", "https://api.anthropic.com/v1")

    def list_models(self) -> List[str]:
        # Anthropic does not expose a model list endpoint; return known models.
        return ["claude-2.1", "claude-instant-1.2"]

    def chat_completion(self, model: str, messages: List[Dict], **kwargs) -> Dict:
        try:
            payload = {
                "model": model,
                "messages": messages,
                **kwargs,
            }
            response = requests.post(
                f"{self.endpoint}/messages",
                headers={"x-api-key": self.api_key, "anthropic-version": "2023-06-01"},
                json=payload,
            )
            response.raise_for_status()
            return response.json()
        except Exception as exc:
            self.record_failure(exc)
            raise ProviderError(f"Anthropic request failed: {exc}")
