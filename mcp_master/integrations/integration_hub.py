#!/usr/bin/env python3
"""
Integration Hub
Central hub that integrates all external project capabilities into mcp_master.
Provides unified access to OpenJarvis, OpenClaude, OpenManus, and other projects.
"""

from __future__ import annotations

import json
import logging
from typing import Any, Dict, List, Optional

from .openjarvis_mcp_adapter import (
    MCPClientAdapter,
    MCPServerAdapter,
    OpenJarvisIntegration,
    ToolSpec,
)
from .connector_system import ConnectorManager
from .multi_agent_coordinator import TaskCoordinator
from .openclaude_tool_adapters import (
    BashTool,
    FileEditTool,
    OpenClaudeToolFactory,
    WebFetchTool,
    WebSearchTool,
)
from .enhanced_learning import EnhancedLearningNetwork
from .claude_code_variants_adapter import (
    ClaudeCodeVariantsAdapter,
    ProviderRegistry,
    MCPServerRegistry,
)

logger = logging.getLogger(__name__)


class IntegrationHub:
    """Central hub for all external project integrations.
    
    Provides unified access to:
    - OpenJarvis MCP protocol (server/client/transport)
    - OpenClaude tools (web search, web fetch, bash, file edit)
    - OpenManus multi-agent coordinator
    - Connector system (Gmail, Slack, Notion, etc.)
    - Enhanced learning network
    - Claude Code variants (free-claude-code, oh-my-claudecode, everything-claude-code)
    - Provider registry (NVIDIA NIM, OpenRouter, DeepSeek, LMStudio, LlamaCpp)
    - MCP server registry (20+ servers)
    """

    def __init__(self, registry_path: str = "../registry/tool_registry.json"):
        self.registry_path = registry_path
        
        # Initialize components
        self.openjarvis = OpenJarvisIntegration()
        self.connectors = ConnectorManager()
        self.coordinator = TaskCoordinator()
        self.learning = EnhancedLearningNetwork()
        
        # Tool factories
        self.tool_factory = OpenClaudeToolFactory()
        
        # Claude Code variants adapter
        self.claude_variants = ClaudeCodeVariantsAdapter()
        
        logger.info("Integration Hub initialized")

    def start(self) -> Dict[str, Any]:
        """Start all integration components."""
        logger.info("Starting Integration Hub")
        
        # Start OpenJarvis MCP server
        self.openjarvis.start_server()
        
        # Connect in-process client
        self.openjarvis.connect_inprocess()
        
        return {
            "status": "success",
            "message": "Integration Hub started",
            "components": {
                "openjarvis": "running",
                "connectors": "ready",
                "coordinator": "ready",
                "learning": "ready",
                "claude_variants": "ready",
            },
        }

    def stop(self) -> Dict[str, Any]:
        """Stop all integration components."""
        logger.info("Stopping Integration Hub")
        
        self.openjarvis.close()
        
        return {
            "status": "success",
            "message": "Integration Hub stopped",
        }

    def get_status(self) -> Dict[str, Any]:
        """Get status of all integration components."""
        claude_variants_info = self.claude_variants.discover_all_capabilities()
        return {
            "openjarvis": "running" if self.openjarvis.client else "stopped",
            "connectors": self.connectors.get_status(),
            "coordinator": {
                "agents": len(self.coordinator.agents),
                "tasks": len(self.coordinator.tasks),
            },
            "learning": {
                "patterns": len(self.learning.patterns),
                "skills": len(self.learning.skills),
            },
            "claude_variants": {
                "providers": claude_variants_info["providers"]["count"],
                "mcp_servers": claude_variants_info["mcp_servers"]["count"],
            },
        }

    def discover_tools(self) -> List[Dict[str, Any]]:
        """Discover all available tools from all integrations."""
        tools = []
        
        # OpenJarvis tools
        if self.openjarvis.client:
            try:
                mcp_tools = self.openjarvis.discover_tools()
                for tool in mcp_tools:
                    tools.append({
                        "name": tool.name,
                        "description": tool.description,
                        "source": "openjarvis",
                        "parameters": tool.parameters,
                    })
            except Exception as exc:
                logger.warning(f"Failed to discover OpenJarvis tools: {exc}")
        
        # Connector tools
        connector_tools = self.connectors.get_connector_tools()
        tools.extend(connector_tools)
        
        # Built-in OpenClaude tools
        tools.extend([
            {
                "name": "web_search",
                "description": "Search the web for information",
                "source": "openclaude",
                "parameters": {
                    "query": {"type": "string", "description": "Search query"},
                    "max_results": {"type": "integer", "description": "Maximum results"},
                },
            },
            {
                "name": "web_fetch",
                "description": "Fetch content from a URL",
                "source": "openclaude",
                "parameters": {
                    "url": {"type": "string", "description": "URL to fetch"},
                    "prompt": {"type": "string", "description": "Optional processing prompt"},
                },
            },
            {
                "name": "bash",
                "description": "Execute bash commands",
                "source": "openclaude",
                "parameters": {
                    "command": {"type": "string", "description": "Command to execute"},
                    "timeout": {"type": "integer", "description": "Timeout in seconds"},
                },
            },
            {
                "name": "file_edit",
                "description": "Edit files",
                "source": "openclaude",
                "parameters": {
                    "path": {"type": "string", "description": "File path"},
                    "old_string": {"type": "string", "description": "String to replace"},
                    "new_string": {"type": "string", "description": "Replacement string"},
                },
            },
        ])
        
        # Claude Code variants MCP servers
        for server_name in MCPServerRegistry.list_servers():
            server = MCPServerRegistry.get_server(server_name)
            if server:
                tools.append({
                    "name": f"mcp_{server_name}",
                    "description": server.description,
                    "source": "claude_variants",
                    "parameters": {
                        "command": {"type": "string", "description": server.command},
                        "args": {"type": "array", "description": server.args},
                    },
                })
        
        # Provider capabilities
        for provider_name in ProviderRegistry.list_providers():
            provider = ProviderRegistry.get_provider(provider_name)
            if provider:
                tools.append({
                    "name": f"provider_{provider_name}",
                    "description": f"LLM provider: {provider_name} ({provider.transport_type})",
                    "source": "claude_variants",
                    "parameters": {
                        "capabilities": {"type": "array", "description": list(provider.capabilities)},
                    },
                })
        
        return tools

    def execute_tool(self, tool_name: str, **kwargs: Any) -> Dict[str, Any]:
        """Execute a tool by name."""
        # Route to appropriate integration
        if tool_name == "web_search":
            tool = self.tool_factory.create_web_search()
            result = tool.search(kwargs.get("query", ""), kwargs.get("max_results", 5))
            return {
                "success": result.success,
                "content": result.content,
                "metadata": result.metadata,
            }
        elif tool_name == "web_fetch":
            tool = self.tool_factory.create_web_fetch()
            result = tool.fetch(kwargs.get("url", ""), kwargs.get("prompt"))
            return {
                "success": result.success,
                "content": result.content,
                "metadata": result.metadata,
            }
        elif tool_name == "bash":
            tool = self.tool_factory.create_bash()
            result = tool.execute(kwargs.get("command", ""), kwargs.get("timeout", 30))
            return {
                "success": result.success,
                "content": result.content,
                "metadata": result.metadata,
            }
        elif tool_name == "file_edit":
            tool = self.tool_factory.create_file_edit()
            result = tool.edit(
                kwargs.get("path", ""),
                kwargs.get("old_string", ""),
                kwargs.get("new_string", ""),
            )
            return {
                "success": result.success,
                "content": result.content,
                "metadata": result.metadata,
            }
        elif tool_name.startswith("mcp_"):
            # Claude Code variants MCP servers
            server_name = tool_name[4:]  # Remove "mcp_" prefix
            server = MCPServerRegistry.get_server(server_name)
            if server:
                return {
                    "success": True,
                    "content": f"MCP server {server_name} configuration retrieved",
                    "metadata": {
                        "command": server.command,
                        "args": server.args,
                        "description": server.description,
                    },
                }
            return {
                "success": False,
                "content": f"MCP server not found: {server_name}",
            }
        elif tool_name.startswith("provider_"):
            # Provider capabilities
            provider_name = tool_name[9:]  # Remove "provider_" prefix
            provider = ProviderRegistry.get_provider(provider_name)
            if provider:
                return {
                    "success": True,
                    "content": f"Provider {provider_name} capabilities retrieved",
                    "metadata": {
                        "transport_type": provider.transport_type,
                        "capabilities": list(provider.capabilities),
                        "credential_env": provider.credential_env,
                        "default_base_url": provider.default_base_url,
                    },
                }
            return {
                "success": False,
                "content": f"Provider not found: {provider_name}",
            }
        else:
            # Try OpenJarvis
            if self.openjarvis.client:
                try:
                    return self.openjarvis.execute_tool(tool_name, **kwargs)
                except Exception as exc:
                    logger.warning(f"OpenJarvis tool execution failed: {exc}")
            
            return {
                "success": False,
                "content": f"Tool not found: {tool_name}",
            }

    def create_task(self, task_id: str, description: str) -> Dict[str, Any]:
        """Create a task using the multi-agent coordinator."""
        task = self.coordinator.create_task(task_id, description)
        return {
            "id": task.id,
            "description": task.description,
            "status": task.status,
        }

    def execute_task(self, task_id: str) -> Dict[str, Any]:
        """Execute a task using the multi-agent coordinator."""
        task = self.coordinator.execute_task(task_id)
        return {
            "id": task.id,
            "description": task.description,
            "status": task.status,
            "result": task.result,
        }

    def get_connector_status(self) -> Dict[str, Any]:
        """Get status of all connectors."""
        return self.connectors.get_status()

    def get_learning_patterns(self) -> List[Dict[str, Any]]:
        """Get learned patterns from the learning network."""
        patterns = self.learning.get_learned_patterns()
        return [
            {
                "pattern_type": p.pattern_type,
                "pattern": p.pattern,
                "frequency": p.frequency,
                "success_rate": p.success_rate,
            }
            for p in patterns
        ]


# ---------------------------------------------------------------------------
# Export
# ---------------------------------------------------------------------------

__all__ = [
    "IntegrationHub",
]