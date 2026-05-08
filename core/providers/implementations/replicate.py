"""
Replicate Provider Implementation
"""
from core.providers.base import BaseProvider, ProviderError
import requests
from typing import List, Dict, Any

class ReplicateProvider(BaseProvider):
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.api_key = config.get("api_key")
        self.endpoint = config.get("endpoint", "https://api.replicate.com/v1")

    def list_models(self) -> List[str]:
        return ["replicate/llama-2-70b-chat", "replicate/mistral-7b-instruct"]

    def chat_completion(self, model: str, messages: List[Dict], **kwargs) -> Dict:
        try:
            # Replicate uses a different format
            payload = {
                "input": {
                    "prompt": messages[-1].get("content", "") if messages else "",
                    **kwargs
                }
            }
            response = requests.post(
                f"{self.endpoint}/predictions",
                headers={
                    "Authorization": f"Token {self.api_key}",
                    "Content-Type": "application/json"
                },
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except Exception as exc:
            self.record_failure(exc)
            raise ProviderError(f"Replicate request failed: {exc}")
