# AETHELGARD MERGED FILE
# Origin Repository: OpenManus-main
# Original Path: src\agents\reporter_agent.py
# Merge Date: 2026-05-07T19:14:09.397455
# ---

from typing import List
from langchain_core.messages import BaseMessage

from src.llms.llm import get_llm_by_type
from src.config.agents import AGENT_LLM_MAP

class ReporterAgent:
    """Reporter agent that handles report generation tasks."""
    
    def invoke(self, messages: List[BaseMessage]) -> BaseMessage:
        """Process the messages and return a response."""
        llm = get_llm_by_type(AGENT_LLM_MAP["reporter"])
        return llm.invoke(messages)

reporter_agent = ReporterAgent()