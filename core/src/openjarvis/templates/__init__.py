# AETHELGARD MERGED FILE
# Origin Repository: OpenJarvis-main
# Original Path: src\openjarvis\templates\__init__.py
# Merge Date: 2026-05-07T19:13:05.000453
# ---

"""Agent template system — pre-configured agent manifests."""

from openjarvis.templates.agent_templates import (
    AgentTemplate,
    discover_templates,
    load_template,
)

__all__ = ["AgentTemplate", "discover_templates", "load_template"]
