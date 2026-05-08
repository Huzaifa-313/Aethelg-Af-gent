"""
OpenRouter Provider Implementation – aggregates multiple models from various providers.
"""
from core.providers.base import BaseProvider, ProviderError
import requests
from typing import List, Dict, Any

class OpenRouterProvider(BaseProvider):
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.api_key = config.get("api_key")
        self.endpoint = config.get("endpoint", "https://openrouter.ai/api/v1")

    def list_models(self) -> List[str]:
        try:
            response = requests.get(
                f"{self.endpoint}/models",
                headers={"Authorization": f"Bearer {self.api_key}"}
            )
            response.raise_for_status()
            models = [model["id"] for model in response.json().get("data", [])]
            return models if models else ["openai/gpt-3.5-turbo", "anthropic/claude-2"]
        except Exception as exc:
            self.record_failure(exc)
            return ["openai/gpt-3.5-turbo", "anthropic/claude-2", "google/gemini-pro"]

    def chat_completion(self, model: str, messages: List[Dict], **kwargs) -> Dict:
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
            raise ProviderError(f"OpenRouter request failed: {exc}")
