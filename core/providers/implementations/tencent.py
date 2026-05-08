"""
Tencent Hunyuan Provider Implementation
Requires proxy due to regional restrictions.
"""
from core.providers.base import BaseProvider, ProviderError
import requests
from typing import List, Dict, Any

class TencentProvider(BaseProvider):
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.api_key = config.get("api_key")
        self.endpoint = config.get("endpoint", "https://hunyuan.tencentcloudapi.com")

    def list_models(self) -> List[str]:
        return ["hunyuan-pro", "hunyuan-standard", "hunyuan-lite"]

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
            raise ProviderError(f"Tencent request failed: {exc}")
