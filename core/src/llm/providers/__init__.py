# AETHELGARD MERGED FILE
# Origin Repository: everything-claude-code-main
# Original Path: src\llm\providers\__init__.py
# Merge Date: 2026-05-07T19:20:37.057766
# ---

"""Provider adapters for multiple LLM backends."""

from llm.providers.claude import ClaudeProvider
from llm.providers.openai import OpenAIProvider
from llm.providers.ollama import OllamaProvider
from llm.providers.resolver import get_provider, register_provider

__all__ = (
    "ClaudeProvider",
    "OpenAIProvider",
    "OllamaProvider",
    "get_provider",
    "register_provider",
)
