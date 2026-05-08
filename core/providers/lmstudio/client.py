# AETHELGARD MERGED FILE
# Origin Repository: free-claude-code-main
# Original Path: providers\lmstudio\client.py
# Merge Date: 2026-05-07T19:20:50.714779
# ---

"""LM Studio provider implementation."""

from providers.anthropic_messages import AnthropicMessagesTransport
from providers.base import ProviderConfig
from providers.rate_limit import GlobalRateLimiter as GlobalRateLimiter

LMSTUDIO_DEFAULT_BASE_URL = "http://localhost:1234/v1"


class LMStudioProvider(AnthropicMessagesTransport):
    """LM Studio provider using native Anthropic Messages endpoint."""

    def __init__(self, config: ProviderConfig):
        super().__init__(
            config,
            provider_name="LMSTUDIO",
            default_base_url=LMSTUDIO_DEFAULT_BASE_URL,
        )
