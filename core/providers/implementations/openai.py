"""
OpenAI Provider Implementation
Inherits from BaseProvider and implements OpenAI API integration.
"""

from core.providers.base import BaseProvider
import requests
from typing import List, Dict, Any

class OpenAIProvider(BaseProvider):
    """OpenAI LLM provider implementation."""

    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.api_key = config.get("api_key")
        self.endpoint = config.get("endpoint", "https://api.openai.com/v1")

    def list_models(self) -> List[str]:
        """Fetch available models from OpenAI API."""
        try:
            response = requests.get(
                f"{self.endpoint}/models",
                headers={"Authorization": f"Bearer {self.api_key}"}
            )
            response.raise_for_status()
            models = [model["id"] for model in response.json()["data"]]
            return models
        except Exception as exc:
            self.record_failure(exc)
            # Fallback to cached models if available
            return ["gpt-3.5-turbo", "gpt-4"]

    def chat_completion(self, model: str, messages: List[Dict], **kwargs) -> Dict:
        """Make a chat completion request to OpenAI."""
        try:
            payload = {
                "model": model,
                "messages": messages,
                **kwargs
            }
            response = requests.post(
                f"{self.endpoint}/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except Exception as exc:
            self.record_failure(exc)
            raise ProviderError(f"OpenAI chat completion failed: {exc}")
