"""
LocalAI Provider Implementation – local AI server.
"""
from core.providers.base import BaseProvider, ProviderError
import requests
from typing import List, Dict, Any

class LocalAIProvider(BaseProvider):
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.api_key = config.get("api_key", "")
        self.endpoint = config.get("endpoint", "http://localhost:8080/v1")

    def list_models(self) -> List[str]:
        try:
            response = requests.get(f"{self.endpoint}/models")
            response.raise_for_status()
            models = [model["id"] for model in response.json().get("data", [])]
            return models if models else ["gpt-3.5-turbo"]
        except Exception as exc:
            self.record_failure(exc)
            return ["gpt-3.5-turbo", "gpt-4"]

    def chat_completion(self, model: str, messages: List[Dict], **kwargs) -> Dict:
        try:
            payload = {
                "model": model,
                "messages": messages,
                **kwargs
            }
            response = requests.post(
                f"{self.endpoint}/chat/completions",
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except Exception as exc:
            self.record_failure(exc)
            raise ProviderError(f"LocalAI request failed: {exc}")
