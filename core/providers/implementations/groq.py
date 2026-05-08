"""
Groq Provider Implementation – OpenAI-compatible endpoint.
"""
from core.providers.base import BaseProvider, ProviderError
import requests
from typing import List, Dict, Any

class GroqProvider(BaseProvider):
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.api_key = config.get("api_key")
        self.endpoint = config.get("endpoint", "https://api.groq.com/openai/v1")

    def list_models(self) -> List[str]:
        return ["llama2-70b-4096", "llama2-13b-4096", "mixtral-8x7b-32768"]

    def chat_completion(self, model: str, messages: List[Dict], **kwargs) -> Dict:
        try:
            payload = {"model": model, "messages": messages, **kwargs}
            response = requests.post(
                f"{self.endpoint}/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json=payload,
            )
            response.raise_for_status()
            return response.json()
        except Exception as exc:
            self.record_failure(exc)
            raise ProviderError(f"Groq request failed: {exc}")
