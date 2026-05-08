# AETHELGARD MERGED FILE
# Origin Repository: OpenManus-main
# Original Path: tests\integration\test_workflow.py
# Merge Date: 2026-05-07T19:14:13.774455
# ---

import pytest
from src.workflow.graph import build_graph

def test_workflow_initialization():
    """Test that the LangGraph workflow can be initialized."""
    graph = build_graph()
    assert graph is not None