"""
RunPod Provider Implementation
"""
from core.providers.base import BaseProvider, ProviderError
import requests
from typing import List, Dict, Any

class RunPodProvider(BaseProvider):
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.api_key = config.get("api_key")
        self.endpoint = config.get("endpoint", "https://api.runpod.ai/v2"

    def list_models(self) -> List[str]:
        return ["runpod-model-1", "runpod-model-2"]

    def chat_completion(self, model: str, messages: List[Dict], **kwargs) -> Dict:
        try:
            payload = {
                "model": model,
                "messages": messages,
                **kwargs
            }
            response = requests.post(
                f"{self.endpoint}/inference",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except Exception as exc:
            self.record_failure(exc)
            raise ProviderError(f"RunPod request failed: {exc}")
