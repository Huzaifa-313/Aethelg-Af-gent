#!/usr/bin/env python3
"""
OpenClaude Tool Adapters
Integrates OpenClaude tool implementations into mcp_master ecosystem.
Provides web search, web fetch, file operations, and bash execution.
"""

from __future__ import annotations

import json
import logging
import os
import re
import subprocess
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Base Types
# ---------------------------------------------------------------------------

@dataclass
class ToolResult:
    """Result from tool execution."""
    tool_name: str
    content: str
    success: bool = True
    metadata: Dict[str, Any] = field(default_factory=dict)


# ---------------------------------------------------------------------------
# Web Search Tool (from OpenClaude WebSearchTool)
# ---------------------------------------------------------------------------

class WebSearchTool:
    """Web search tool with multiple provider support.
    
    Integrates OpenClaude web search capabilities into mcp_master.
    Supports Tavily API, DuckDuckGo, and other search providers.
    """

    def __init__(self, api_key: Optional[str] = None, max_results: int = 5):
        self._api_key = api_key or os.environ.get("TAVILY_API_KEY")
        self._max_results = max_results

    def search(self, query: str, max_results: Optional[int] = None) -> ToolResult:
        """Search the web for information."""
        max_results = max_results or self._max_results
        
        # Try Tavily first
        if self._api_key:
            try:
                return self._search_tavily(query, max_results)
            except Exception as exc:
                logger.debug(f"Tavily search failed: {exc}")
        
        # Fallback to DuckDuckGo
        try:
            return self._search_duckduckgo(query, max_results)
        except Exception as exc:
            logger.debug(f"DuckDuckGo search failed: {exc}")
        
        return ToolResult(
            tool_name="web_search",
            content="Search failed. Please install tavily-python or ddgs.",
            success=False,
        )

    def _search_tavily(self, query: str, max_results: int) -> ToolResult:
        """Search using Tavily API."""
        try:
            from tavily import TavilyClient
            client = TavilyClient(api_key=self._api_key)
            response = client.search(query, max_results=max_results)
            results = response.get("results", [])
            formatted = "\n\n".join(
                f"**{r.get('title', 'Untitled')}**\n"
                f"{r.get('url', '')}\n{r.get('content', '')}"
                for r in results
            )
            return ToolResult(
                tool_name="web_search",
                content=formatted or "No results found.",
                success=True,
                metadata={"num_results": len(results), "engine": "tavily"},
            )
        except ImportError:
            raise RuntimeError("tavily-python not installed")

    def _search_duckduckgo(self, query: str, max_results: int) -> ToolResult:
        """Search using DuckDuckGo."""
        try:
            from ddgs import DDGS
            ddgs = DDGS()
            results = list(ddgs.text(query, max_results=max_results))
            formatted = "\n\n".join(
                f"**{r.get('title', 'Untitled')}**\n"
                f"{r.get('href', '')}\n{r.get('body', '')}"
                for r in results
            )
            return ToolResult(
                tool_name="web_search",
                content=formatted or "No results found.",
                success=True,
                metadata={"engine": "duckduckgo"},
            )
        except ImportError:
            raise RuntimeError("ddgs not installed")


# ---------------------------------------------------------------------------
# Web Fetch Tool (from OpenClaude WebFetchTool)
# ---------------------------------------------------------------------------

class WebFetchTool:
    """Web fetch tool for extracting content from URLs.
    
    Integrates OpenClaude web fetch capabilities into mcp_master.
    Supports Firecrawl and direct HTTP fetching.
    """

    def __init__(self):
        self._firecrawl_enabled = bool(os.environ.get("FIRECRAWL_API_KEY"))

    def fetch(self, url: str, prompt: Optional[str] = None) -> ToolResult:
        """Fetch content from a URL."""
        try:
            if self._firecrawl_enabled:
                return self._fetch_with_firecrawl(url, prompt)
            else:
                return self._fetch_direct(url, prompt)
        except Exception as exc:
            return ToolResult(
                tool_name="web_fetch",
                content=f"Fetch failed: {exc}",
                success=False,
            )

    def _fetch_with_firecrawl(self, url: str, prompt: Optional[str] = None) -> ToolResult:
        """Fetch using Firecrawl."""
        try:
            from firecrawl import FirecrawlApp
            app = FirecrawlApp(api_key=os.environ["FIRECRAWL_API_KEY"])
            result = app.scrape_url(url, params={"formats": ["markdown"]})
            markdown = result.get("markdown", "")
            return ToolResult(
                tool_name="web_fetch",
                content=markdown,
                success=True,
                metadata={"engine": "firecrawl", "url": url},
            )
        except ImportError:
            return self._fetch_direct(url, prompt)

    def _fetch_direct(self, url: str, prompt: Optional[str] = None) -> ToolResult:
        """Fetch directly using HTTP."""
        import httpx
        
        resp = httpx.get(
            url,
            follow_redirects=True,
            timeout=30.0,
            headers={
                "User-Agent": "Mozilla/5.0 (compatible; MCP-Master/1.0)"
            },
        )
        resp.raise_for_status()
        
        content_type = resp.headers.get("content-type", "")
        if "application/pdf" in content_type:
            return ToolResult(
                tool_name="web_fetch",
                content=f"[PDF file: {url}]",
                success=True,
                metadata={"url": url, "type": "pdf"},
            )
        
        # Strip HTML tags
        html = resp.text
        text = re.sub(r"<[^>]+>", " ", html)
        text = re.sub(r"\s+", " ", text).strip()
        
        if len(text) > 10000:
            text = text[:10000] + "\n\n[Content truncated]"
        
        return ToolResult(
            tool_name="web_fetch",
            content=text,
            success=True,
            metadata={"url": url, "type": "html"},
        )


# ---------------------------------------------------------------------------
# Bash Tool (from OpenClaude BashTool)
# ---------------------------------------------------------------------------

class BashTool:
    """Bash execution tool with security validation.
    
    Integrates OpenClaude bash tool capabilities into mcp_master.
    Provides safe shell command execution with validation.
    """

    # Dangerous commands that should be blocked
    DANGEROUS_PATTERNS = [
        r"rm\s+-rf\s+/",
        r"dd\s+if=.*of=/dev",
        r"mkfs\.",
        r":\(\)\{\s*:\|:\&",
        r"curl\s+.*\|\s*sh",
        r"wget\s+.*\|\s*sh",
    ]

    def __init__(self, allowed_commands: Optional[List[str]] = None):
        self._allowed_commands = allowed_commands or []

    def execute(self, command: str, timeout: int = 30) -> ToolResult:
        """Execute a bash command safely."""
        # Security check
        if self._is_dangerous(command):
            return ToolResult(
                tool_name="bash",
                content=f"Command blocked for security: {command}",
                success=False,
            )
        
        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=timeout,
            )
            
            output = result.stdout
            if result.stderr:
                output += f"\n[stderr]: {result.stderr}"
            
            return ToolResult(
                tool_name="bash",
                content=output,
                success=result.returncode == 0,
                metadata={"returncode": result.returncode},
            )
        except subprocess.TimeoutExpired:
            return ToolResult(
                tool_name="bash",
                content=f"Command timed out after {timeout} seconds",
                success=False,
            )
        except Exception as exc:
            return ToolResult(
                tool_name="bash",
                content=f"Execution error: {exc}",
                success=False,
            )

    def _is_dangerous(self, command: str) -> bool:
        """Check if a command is dangerous."""
        for pattern in self.DANGEROUS_PATTERNS:
            if re.search(pattern, command):
                return True
        return False


# ---------------------------------------------------------------------------
# File Edit Tool (from OpenClaude FileEditTool)
# ---------------------------------------------------------------------------

class FileEditTool:
    """File editing tool with safe operations.
    
    Integrates OpenClaude file edit capabilities into mcp_master.
    Provides read, write, and edit operations.
    """

    def read(self, path: str) -> ToolResult:
        """Read a file."""
        try:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            return ToolResult(
                tool_name="file_read",
                content=content,
                success=True,
                metadata={"path": path, "size": len(content)},
            )
        except Exception as exc:
            return ToolResult(
                tool_name="file_read",
                content=f"Read error: {exc}",
                success=False,
            )

    def write(self, path: str, content: str) -> ToolResult:
        """Write to a file."""
        try:
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            return ToolResult(
                tool_name="file_write",
                content=f"File written: {path}",
                success=True,
                metadata={"path": path, "size": len(content)},
            )
        except Exception as exc:
            return ToolResult(
                tool_name="file_write",
                content=f"Write error: {exc}",
                success=False,
            )

    def edit(self, path: str, old_string: str, new_string: str) -> ToolResult:
        """Edit a file by replacing a string."""
        try:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            
            if old_string not in content:
                return ToolResult(
                    tool_name="file_edit",
                    content=f"String not found in file: {old_string}",
                    success=False,
                )
            
            new_content = content.replace(old_string, new_string, 1)
            
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_content)
            
            return ToolResult(
                tool_name="file_edit",
                content=f"File edited: {path}",
                success=True,
                metadata={"path": path},
            )
        except Exception as exc:
            return ToolResult(
                tool_name="file_edit",
                content=f"Edit error: {exc}",
                success=False,
            )


# ---------------------------------------------------------------------------
# Tool Factory
# ---------------------------------------------------------------------------

class OpenClaudeToolFactory:
    """Factory for creating OpenClaude tool instances."""

    @staticmethod
    def create_web_search(api_key: Optional[str] = None) -> WebSearchTool:
        """Create a web search tool."""
        return WebSearchTool(api_key=api_key)

    @staticmethod
    def create_web_fetch() -> WebFetchTool:
        """Create a web fetch tool."""
        return WebFetchTool()

    @staticmethod
    def create_bash() -> BashTool:
        """Create a bash tool."""
        return BashTool()

    @staticmethod
    def create_file_edit() -> FileEditTool:
        """Create a file edit tool."""
        return FileEditTool()


# ---------------------------------------------------------------------------
# Export
# ---------------------------------------------------------------------------

__all__ = [
    "ToolResult",
    "WebSearchTool",
    "WebFetchTool",
    "BashTool",
    "FileEditTool",
    "OpenClaudeToolFactory",
]