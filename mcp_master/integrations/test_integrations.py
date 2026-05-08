#!/usr/bin/env python3
"""
Integration Tests for Phase 8
Tests all integrated components from external projects.
"""

import json
import os
import sys
import unittest
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from integrations.openjarvis_mcp_adapter import (
    MCPClientAdapter,
    MCPServerAdapter,
    MCPRequest,
    MCPResponse,
    OpenJarvisIntegration,
    ToolSpec,
    ToolResult,
)
from integrations.connector_system import (
    ConnectorManager,
    ConnectorRegistry,
    GmailConnector,
    SlackConnector,
)
from integrations.multi_agent_coordinator import (
    TaskCoordinator,
    PlannerAgent,
    ExecutionAgent,
    ToolAgent,
)
from integrations.openclaude_tool_adapters import (
    WebSearchTool,
    WebFetchTool,
    BashTool,
    FileEditTool,
    OpenClaudeToolFactory,
)
from integrations.enhanced_learning import (
    EnhancedLearningNetwork,
    LearnedPattern,
    SkillOptimization,
)
from integrations.integration_hub import IntegrationHub


class TestOpenJarvisMCPAdapter(unittest.TestCase):
    """Test OpenJarvis MCP adapter."""

    def test_mcp_request_creation(self):
        """Test MCP request creation."""
        request = MCPRequest(method="initialize", params={"test": "value"})
        self.assertEqual(request.method, "initialize")
        self.assertEqual(request.params, {"test": "value"})

    def test_mcp_response_creation(self):
        """Test MCP response creation."""
        response = MCPResponse(result={"status": "ok"})
        self.assertEqual(response.result, {"status": "ok"})
        self.assertIsNone(response.error)

    def test_mcp_server_adapter(self):
        """Test MCP server adapter."""
        server = MCPServerAdapter()
        self.assertIsNotNone(server)

    def test_openjarvis_integration(self):
        """Test OpenJarvis integration."""
        integration = OpenJarvisIntegration()
        self.assertIsNotNone(integration)
        self.assertIsNotNone(integration.server)


class TestConnectorSystem(unittest.TestCase):
    """Test connector system."""

    def test_connector_registry(self):
        """Test connector registry."""
        registry = ConnectorRegistry()
        self.assertIsNotNone(registry)

    def test_connector_manager(self):
        """Test connector manager."""
        manager = ConnectorManager()
        self.assertIsNotNone(manager)
        status = manager.get_status()
        self.assertIn("connectors", status)

    def test_gmail_connector(self):
        """Test Gmail connector."""
        connector = GmailConnector()
        self.assertEqual(connector.connector_id, "gmail")
        self.assertFalse(connector.is_connected())

    def test_slack_connector(self):
        """Test Slack connector."""
        connector = SlackConnector()
        self.assertEqual(connector.connector_id, "slack")
        self.assertFalse(connector.is_connected())


class TestMultiAgentCoordinator(unittest.TestCase):
    """Test multi-agent coordinator."""

    def test_task_coordinator(self):
        """Test task coordinator."""
        coordinator = TaskCoordinator()
        self.assertIsNotNone(coordinator)
        self.assertGreater(len(coordinator.agents), 0)

    def test_planner_agent(self):
        """Test planner agent."""
        agent = PlannerAgent()
        self.assertEqual(agent.name, "Planner")

    def test_execution_agent(self):
        """Test execution agent."""
        agent = ExecutionAgent()
        self.assertEqual(agent.name, "Executor")

    def test_tool_agent(self):
        """Test tool agent."""
        agent = ToolAgent()
        self.assertEqual(agent.name, "Tool User")

    def test_task_creation(self):
        """Test task creation."""
        coordinator = TaskCoordinator()
        task = coordinator.create_task("test_001", "Test task")
        self.assertEqual(task.id, "test_001")
        self.assertEqual(task.description, "Test task")


class TestOpenClaudeToolAdapters(unittest.TestCase):
    """Test OpenClaude tool adapters."""

    def test_web_search_tool(self):
        """Test web search tool."""
        tool = WebSearchTool()
        self.assertIsNotNone(tool)

    def test_web_fetch_tool(self):
        """Test web fetch tool."""
        tool = WebFetchTool()
        self.assertIsNotNone(tool)

    def test_bash_tool(self):
        """Test bash tool."""
        tool = BashTool()
        self.assertIsNotNone(tool)

    def test_file_edit_tool(self):
        """Test file edit tool."""
        tool = FileEditTool()
        self.assertIsNotNone(tool)

    def test_tool_factory(self):
        """Test tool factory."""
        factory = OpenClaudeToolFactory()
        self.assertIsNotNone(factory)


class TestEnhancedLearning(unittest.TestCase):
    """Test enhanced learning network."""

    def test_learning_network(self):
        """Test learning network."""
        network = EnhancedLearningNetwork()
        self.assertIsNotNone(network)

    def test_record_interaction(self):
        """Test recording interactions."""
        network = EnhancedLearningNetwork()
        network.record_interaction("agent_001", "tool_001", True, 1.0)
        self.assertGreater(len(network.patterns), 0)

    def test_get_recommendations(self):
        """Test getting recommendations."""
        network = EnhancedLearningNetwork()
        network.record_interaction("agent_001", "tool_001", True, 1.0)
        recommendations = network.get_tool_recommendations("agent_001", "test task")
        self.assertIsInstance(recommendations, list)


class TestIntegrationHub(unittest.TestCase):
    """Test integration hub."""

    def test_hub_creation(self):
        """Test hub creation."""
        hub = IntegrationHub()
        self.assertIsNotNone(hub)

    def test_hub_status(self):
        """Test hub status."""
        hub = IntegrationHub()
        status = hub.get_status()
        self.assertIn("openjarvis", status)
        self.assertIn("connectors", status)
        self.assertIn("coordinator", status)
        self.assertIn("learning", status)

    def test_discover_tools(self):
        """Test tool discovery."""
        hub = IntegrationHub()
        tools = hub.discover_tools()
        self.assertIsInstance(tools, list)
        self.assertGreater(len(tools), 0)

    def test_create_task(self):
        """Test task creation."""
        hub = IntegrationHub()
        result = hub.create_task("test_001", "Test task")
        self.assertEqual(result["id"], "test_001")
        self.assertEqual(result["description"], "Test task")


class TestRegistry(unittest.TestCase):
    """Test updated registry."""

    def test_registry_exists(self):
        """Test registry file exists."""
        registry_path = Path(__file__).parent / "updated_registry.json"
        self.assertTrue(registry_path.exists())

    def test_registry_valid_json(self):
        """Test registry is valid JSON."""
        registry_path = Path(__file__).parent / "updated_registry.json"
        with open(registry_path) as f:
            data = json.load(f)
        self.assertIn("version", data)
        self.assertIn("tools", data)

    def test_registry_has_phase8_tools(self):
        """Test registry has Phase 8 tools."""
        registry_path = Path(__file__).parent / "updated_registry.json"
        with open(registry_path) as f:
            data = json.load(f)
        
        tools = data.get("tools", {})
        self.assertIn("openjarvis-web-search", tools)
        self.assertIn("openjarvis-connectors", tools)
        self.assertIn("openclaude-web-search", tools)
        self.assertIn("openclaude-web-fetch", tools)
        self.assertIn("openclaude-bash", tools)
        self.assertIn("openclaude-file-edit", tools)
        self.assertIn("openmanus-coordinator", tools)
        self.assertIn("enhanced-learning", tools)


def run_tests():
    """Run all integration tests."""
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add all test classes
    test_classes = [
        TestOpenJarvisMCPAdapter,
        TestConnectorSystem,
        TestMultiAgentCoordinator,
        TestOpenClaudeToolAdapters,
        TestEnhancedLearning,
        TestIntegrationHub,
        TestRegistry,
    ]
    
    for test_class in test_classes:
        tests = loader.loadTestsFromTestCase(test_class)
        suite.addTests(tests)
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return result.wasSuccessful()


if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
