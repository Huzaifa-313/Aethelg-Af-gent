#!/usr/bin/env python3
"""
Claude Code Variants Adapter
Integrates capabilities from free-claude-code, oh-my-claudecode, everything-claude-code,
and awesome-claude-code-toolkit into mcp_master ecosystem.
"""

from __future__ import annotations

import json
import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class ProviderDescriptor:
    """Descriptor for LLM provider configuration."""
    
    def __init__(
        self,
        provider_id: str,
        transport_type: str,
        capabilities: tuple,
        credential_env: Optional[str] = None,
        default_base_url: Optional[str] = None,
    ):
        self.provider_id = provider_id
        self.transport_type = transport_type
        self.capabilities = capabilities
        self.credential_env = credential_env
        self.default_base_url = default_base_url


class ProviderRegistry:
    """Registry of LLM providers from free-claude-code."""
    
    PROVIDERS = {
        "nvidia_nim": ProviderDescriptor(
            provider_id="nvidia_nim",
            transport_type="openai_chat",
            capabilities=("chat", "streaming", "tools", "thinking", "rate_limit"),
            credential_env="NVIDIA_NIM_API_KEY",
            default_base_url="https://integrate.api.nvidia.com/v1",
        ),
        "open_router": ProviderDescriptor(
            provider_id="open_router",
            transport_type="anthropic_messages",
            capabilities=("chat", "streaming", "tools", "thinking", "native_anthropic"),
            credential_env="OPENROUTER_API_KEY",
            default_base_url="https://openrouter.ai/api/v1",
        ),
        "deepseek": ProviderDescriptor(
            provider_id="deepseek",
            transport_type="openai_chat",
            capabilities=("chat", "streaming", "thinking"),
            credential_env="DEEPSEEK_API_KEY",
            default_base_url="https://api.deepseek.com/v1",
        ),
        "lmstudio": ProviderDescriptor(
            provider_id="lmstudio",
            transport_type="anthropic_messages",
            capabilities=("chat", "streaming", "tools", "native_anthropic", "local"),
            default_base_url="http://localhost:1234/v1",
        ),
        "llamacpp": ProviderDescriptor(
            provider_id="llamacpp",
            transport_type="anthropic_messages",
            capabilities=("chat", "streaming", "tools", "native_anthropic", "local"),
            default_base_url="http://localhost:8080/v1",
        ),
    }
    
    @classmethod
    def get_provider(cls, provider_id: str) -> Optional[ProviderDescriptor]:
        return cls.PROVIDERS.get(provider_id)
    
    @classmethod
    def list_providers(cls) -> List[str]:
        return list(cls.PROVIDERS.keys())
    
    @classmethod
    def get_capabilities(cls, provider_id: str) -> tuple:
        provider = cls.PROVIDERS.get(provider_id)
        return provider.capabilities if provider else ()


class MCPServerConfig:
    """MCP Server configuration from oh-my-claudecode and everything-claude-code."""
    
    def __init__(self, command: str, args: List[str], env: Optional[Dict] = None, description: str = ""):
        self.command = command
        self.args = args
        self.env = env or {}
        self.description = description
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "command": self.command,
            "args": self.args,
            "env": self.env,
            "description": self.description,
        }


class MCPServerRegistry:
    """Registry of MCP server configurations."""
    
    SERVERS = {
        "exa": MCPServerConfig(
            command="npx",
            args=["-y", "exa-mcp-server"],
            description="AI-powered web search via Exa API",
        ),
        "context7": MCPServerConfig(
            command="npx",
            args=["-y", "@upstash/context7-mcp"],
            description="Official documentation lookup",
        ),
        "playwright": MCPServerConfig(
            command="npx",
            args=["-y", "@playwright/mcp@latest"],
            description="Browser automation for web interaction",
        ),
        "filesystem": MCPServerConfig(
            command="npx",
            args=["-y", "@modelcontextprotocol/server-filesystem"],
            description="Sandboxed file system access",
        ),
        "memory": MCPServerConfig(
            command="npx",
            args=["-y", "@modelcontextprotocol/server-memory"],
            description="Persistent knowledge graph across sessions",
        ),
        "sequential-thinking": MCPServerConfig(
            command="npx",
            args=["-y", "@modelcontextprotocol/server-sequential-thinking"],
            description="Chain-of-thought reasoning",
        ),
        "github": MCPServerConfig(
            command="npx",
            args=["-y", "@modelcontextprotocol/server-github"],
            description="GitHub operations - PRs, issues, repos",
        ),
        "postgres": MCPServerConfig(
            command="npx",
            args=["-y", "@modelcontextprotocol/server-postgres"],
            description="Query PostgreSQL databases",
        ),
        "redis": MCPServerConfig(
            command="npx",
            args=["-y", "@modelcontextprotocol/server-redis"],
            description="Interact with Redis cache",
        ),
        "docker": MCPServerConfig(
            command="npx",
            args=["-y", "@modelcontextprotocol/server-docker"],
            description="Manage Docker containers and images",
        ),
        "fetch": MCPServerConfig(
            command="npx",
            args=["-y", "@modelcontextprotocol/server-fetch"],
            description="Fetch web pages and convert to markdown",
        ),
        "brave-search": MCPServerConfig(
            command="npx",
            args=["-y", "@modelcontextprotocol/server-brave-search"],
            description="Web search via Brave Search API",
        ),
        "sqlite": MCPServerConfig(
            command="npx",
            args=["-y", "@modelcontextprotocol/server-sqlite"],
            description="Query and manage SQLite databases",
        ),
        "puppeteer": MCPServerConfig(
            command="npx",
            args=["-y", "@modelcontextprotocol/server-puppeteer"],
            description="Browser automation via Puppeteer",
        ),
        "slack": MCPServerConfig(
            command="npx",
            args=["-y", "@modelcontextprotocol/server-slack"],
            description="Read and send Slack messages",
        ),
        "linear": MCPServerConfig(
            command="npx",
            args=["-y", "mcp-linear"],
            description="Manage Linear issues and projects",
        ),
        "sentry": MCPServerConfig(
            command="npx",
            args=["-y", "@sentry/mcp-server"],
            description="Query Sentry for errors and performance",
        ),
        "firecrawl": MCPServerConfig(
            command="npx",
            args=["-y", "firecrawl-mcp"],
            description="Crawl and scrape websites",
        ),
        "jira": MCPServerConfig(
            command="uvx",
            args=["mcp-atlassian==0.21.0"],
            description="Jira issue tracking",
        ),
        "supabase": MCPServerConfig(
            command="npx",
            args=["-y", "@supabase/mcp-server-supabase@latest"],
            description="Supabase database operations",
        ),
    }
    
    @classmethod
    def get_server(cls, name: str) -> Optional[MCPServerConfig]:
        return cls.SERVERS.get(name)
    
    @classmethod
    def list_servers(cls) -> List[str]:
        return list(cls.SERVERS.keys())
    
    @classmethod
    def get_servers_by_category(cls, category: str) -> List[str]:
        categories = {
            "search": ["exa", "brave-search", "firecrawl"],
            "database": ["postgres", "redis", "sqlite", "supabase"],
            "devops": ["docker", "github"],
            "communication": ["slack", "linear", "jira"],
            "memory": ["memory", "sequential-thinking"],
            "automation": ["playwright", "puppeteer", "fetch"],
            "monitoring": ["sentry"],
            "filesystem": ["filesystem"],
            "documentation": ["context7"],
        }
        return categories.get(category, [])


class ClaudeCodeVariantsAdapter:
    """Adapter integrating all Claude Code variant capabilities."""
    
    def __init__(self):
        self.provider_registry = ProviderRegistry()
        self.mcp_registry = MCPServerRegistry()
        logger.info("ClaudeCodeVariantsAdapter initialized")
    
    def get_provider_capabilities(self, provider_id: str) -> Dict[str, Any]:
        provider = self.provider_registry.get_provider(provider_id)
        if not provider:
            return {"error": f"Provider {provider_id} not found"}
        return {
            "provider_id": provider.provider_id,
            "transport_type": provider.transport_type,
            "capabilities": list(provider.capabilities),
            "credential_env": provider.credential_env,
            "default_base_url": provider.default_base_url,
        }
    
    def get_mcp_server_config(self, name: str) -> Dict[str, Any]:
        server = self.mcp_registry.get_server(name)
        if not server:
            return {"error": f"MCP server {name} not found"}
        return server.to_dict()
    
    def discover_all_capabilities(self) -> Dict[str, Any]:
        return {
            "providers": {
                "count": len(self.provider_registry.PROVIDERS),
                "list": self.provider_registry.list_providers(),
            },
            "mcp_servers": {
                "count": len(self.mcp_registry.SERVERS),
                "list": self.mcp_registry.list_servers(),
                "categories": {
                    cat: self.mcp_registry.get_servers_by_category(cat)
                    for cat in ["search", "database", "devops", "communication", "memory", "automation", "monitoring", "filesystem", "documentation"]
                },
            },
        }


if __name__ == "__main__":
    adapter = ClaudeCodeVariantsAdapter()
    print(json.dumps(adapter.discover_all_capabilities(), indent=2))
