"""
Google (Gemini) Provider Implementation
"""
from core.providers.base import BaseProvider, ProviderError
import requests
from typing import List, Dict, Any

class GoogleProvider(BaseProvider):
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.api_key = config.get("api_key")
        self.endpoint = config.get("endpoint", "https://generativelanguage.googleapis.com/v1beta")

    def list_models(self) -> List[str]:
        return ["gemini-pro", "gemini-pro-vision"]

    def chat_completion(self, model: str, messages: List[Dict], **kwargs) -> Dict:
        try:
            url = f"{self.endpoint}/models/{model}:generateContent?key={self.api_key}"
            payload = {"contents": messages, **kwargs}
            response = requests.post(url, json=payload)
            response.raise_for_status()
            return response.json()
        except Exception as exc:
            self.record_failure(exc)
            raise ProviderError(f"Google request failed: {exc}")
