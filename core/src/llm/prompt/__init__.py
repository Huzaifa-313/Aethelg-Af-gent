# AETHELGARD MERGED FILE
# Origin Repository: everything-claude-code-main
# Original Path: src\llm\prompt\__init__.py
# Merge Date: 2026-05-07T19:20:36.246766
# ---

"""Prompt module for prompt building and normalization."""

from llm.prompt.builder import PromptBuilder, adapt_messages_for_provider, get_provider_builder
from llm.prompt.templates import TEMPLATES, get_template, get_template_or_default

__all__ = (
    "PromptBuilder",
    "TEMPLATES",
    "adapt_messages_for_provider",
    "get_provider_builder",
    "get_template",
    "get_template_or_default",
)
