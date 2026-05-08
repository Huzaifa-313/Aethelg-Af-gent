"""
Custom Template Provider – fully documented template for adding any unknown API.
Inherit from this class and override the required methods to integrate a new provider.
"""

from core.providers.base import BaseProvider, ProviderError
import requests
from typing import List, Dict, Any

class CustomTemplateProvider(BaseProvider):
    """
    Template for creating custom provider implementations.

    Steps to create a new provider:
    1. Copy this file to a new file named after your provider.
    2. Rename the class to match your provider (e.g., MyProvider).
    3. Update __init__ to read provider-specific config.
    4. Implement list_models() to return available model identifiers.
    5. Implement chat_completion() to make API calls to your provider.
    6. Update core/providers/config.yaml with your provider's configuration.
    7. Test your implementation.

    Example:
        class MyProvider(CustomTemplateProvider):
            def list_models(self):
                return ["my-model-1", "my-model-2"]

            def chat_completion(self, model, messages, **kwargs):
                # Your API call logic here
                pass
    """

    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.api_key = config.get("api_key")
        self.endpoint = config.get("endpoint", "https://your-custom-endpoint.com/v1")

    def list_models(self) -> List[str]:
        """
        Return a list of model identifiers supported by this provider.
        Override this method with actual API call or static list.
        """
        # Example static list - replace with API call if available
        return ["custom-model-1", "custom-model-2"]

    def chat_completion(self, model: str, messages: List[Dict], **kwargs) -> Dict:
        """
        Perform a chat completion request to the custom provider.
        Override this method with actual API integration.
        """
        try:
            payload = {
                "model": model,
                "messages": messages,
                **kwargs
            }
            # Example request - adjust headers and endpoint as needed
            response = requests.post(
                f"{self.endpoint}/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except Exception as exc:
            self.record_failure(exc)
            raise ProviderError(f"Custom provider request failed: {exc}")

    def health_check(self) -> bool:
        """Override with provider-specific health check if needed."""
        return super().health_check()
