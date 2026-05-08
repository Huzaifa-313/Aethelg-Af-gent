"""
Hugging Face Provider Implementation
"""
from core.providers.base import BaseProvider, ProviderError
import requests
from typing import List, Dict, Any

class HuggingFaceProvider(BaseProvider):
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.api_key = config.get("api_key")
        self.endpoint = config.get("endpoint", "https://api-inference.huggingface.co")

    def list_models(self) -> List[str]:
        return ["meta-llama/Llama-2-70b-chat-hf", "mistralai/Mistral-7B-Instruct-v0.1"]

    def chat_completion(self, model: str, messages: List[Dict], **kwargs) -> Dict:
        try:
            # HuggingFace uses a different endpoint structure
            payload = {
                "inputs": messages[-1].get("content", "") if messages else "",
                **kwargs
            }
            response = requests.post(
                f"{self.endpoint}/models/{model}",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json=payload
            )
            response.raise_for_status()
            return {"generated_text": response.json()}
        except Exception as exc:
            self.record_failure(exc)
            raise ProviderError(f"HuggingFace request failed: {exc}")
