# AETHELGARD MERGED FILE
# Origin Repository: OpenManus-main
# Original Path: src\agents\__init__.py
# Merge Date: 2026-05-07T19:14:09.615455
# ---

# Initialize agents package

from .browser_agent import browser_agent
from .coder_agent import coder_agent
from .research_agent import research_agent
from .reporter_agent import reporter_agent

__all__ = [
    'browser_agent',
    'coder_agent',
    'research_agent',
    'reporter_agent',
]