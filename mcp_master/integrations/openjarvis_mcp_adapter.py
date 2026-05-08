#!/usr/bin/env python3
"""
OpenJarvis MCP Protocol Adapter
Integrates OpenJarvis MCP server/client/transport into mcp_master ecosystem.
Provides full JSON-RPC 2.0 MCP protocol support with auto-discovery.
"""

from __future__ import annotations

import json
import logging
import os
import subprocess
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, TypeVar, Type

# Configure logging
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# MCP Protocol Types (from OpenJarvis)
# ---------------------------------------------------------------------------

PARSE_ERROR = -32700
INVALID_REQUEST = -32600
METHOD_NOT_FOUND = -32601
INVALID_PARAMS = -32602
INTERNAL_ERROR = -32603


@dataclass
class MCPRequest:
    """JSON-RPC 2.0 request message."""
    method: str
    params: Dict[str, Any] = field(default_factory=dict)
    id: Optional[int | str] = 0
    jsonrpc: str = "2.0"

    def to_dict(self) -> Dict[str, Any]:
        obj: Dict[str, Any] = {
            "jsonrpc": self.jsonrpc,
            "method": self.method,
            "params": self.params,
        }
        if self.id is not None:
            obj["id"] = self.id
        return obj

    def to_json(self) -> str:
        return json.dumps(self.to_dict())

    @classmethod
    def from_json(cls, data: str) -> "MCPRequest":
        parsed = json.loads(data)
        return cls(
            method=parsed["method"],
            params=parsed.get("params", {}),
            id=parsed.get("id", 0),
            jsonrpc=parsed.get("jsonrpc", "2.0"),
        )


@dataclass
class MCPResponse:
    """JSON-RPC 2.0 response message."""
    result: Any = None
    error: Optional[Dict[str, Any]] = None
    id: int | str = 0
    jsonrpc: str = "2.0"

    def to_json(self) -> str:
        obj: Dict[str, Any] = {"jsonrpc": self.jsonrpc, "id": self.id}
        if self.error is not None:
            obj["error"] = self.error
        else:
            obj["result"] = self.result
        return json.dumps(obj)

    @classmethod
    def from_json(cls, data: str) -> "MCPResponse":
        parsed = json.loads(data)
        return cls(
            result=parsed.get("result"),
            error=parsed.get("error"),
            id=parsed.get("id", 0),
            jsonrpc=parsed.get("jsonrpc", "2.0"),
        )

    @classmethod
    def error_response(cls, id: int | str, code: int, message: str, data: Any = None) -> "MCPResponse":
        error: Dict[str, Any] = {"code": code, "message": message}
        if data is not None:
            error["data"] = data
        return cls(error=error, id=id)


@dataclass
class MCPError(Exception):
    """MCP protocol error with JSON-RPC error code."""
    code: int
    message: str
    data: Any = None

    def __str__(self) -> str:
        return f"MCPError({self.code}): {self.message}"


# ---------------------------------------------------------------------------
# Transport Layer
# ---------------------------------------------------------------------------

class MCPTransport(ABC):
    """Abstract transport layer for MCP communication."""

    @abstractmethod
    def send(self, request: MCPRequest) -> MCPResponse:
        """Send a request and return the response."""

    def send_notification(self, request: MCPRequest) -> None:
        self.send(request)

    @abstractmethod
    def close(self) -> None:
        """Release transport resources."""


class InProcessTransport(MCPTransport):
    """Direct in-process transport for testing."""

    def __init__(self, server: "MCPServerAdapter") -> None:
        self._server = server

    def send(self, request: MCPRequest) -> MCPResponse:
        return self._server.handle(request)

    def close(self) -> None:
        pass


class StdioTransport(MCPTransport):
    """JSON-RPC over stdin/stdout subprocess transport."""

    def __init__(self, command: List[str]) -> None:
        self._command = command
        self._process: Optional[subprocess.Popen] = None
        self._start()

    def _start(self) -> None:
        self._process = subprocess.Popen(
            self._command,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

    def send(self, request: MCPRequest) -> MCPResponse:
        proc = self._process
        if proc is None or proc.stdin is None or proc.stdout is None:
            raise RuntimeError("Transport process is not running")

        line = request.to_json() + "\n"
        proc.stdin.write(line)
        proc.stdin.flush()

        response_line = proc.stdout.readline()
        if not response_line:
            raise RuntimeError("No response from subprocess")
        return MCPResponse.from_json(response_line.strip())

    def close(self) -> None:
        if self._process is not None:
            self._process.terminate()
            self._process.wait(timeout=5)
            self._process = None


# ---------------------------------------------------------------------------
# MCP Server Adapter
# ---------------------------------------------------------------------------

@dataclass
class ToolSpec:
    """Tool specification for MCP."""
    name: str
    description: str
    parameters: Dict[str, Any] = field(default_factory=dict)
    category: str = ""
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class ToolResult:
    """Result from tool execution."""
    tool_name: str
    content: str
    success: bool = True
    metadata: Dict[str, Any] = field(default_factory=dict)


class MCPServerAdapter:
    """MCP Server that exposes tools via JSON-RPC.
    
    Integrates OpenJarvis MCP protocol into mcp_master ecosystem.
    Provides auto-discovery of tools and full JSON-RPC 2.0 compliance.
    """

    def __init__(self, tools: Optional[List[Any]] = None) -> None:
        self._tools: Dict[str, Any] = {}
        self._tool_annotations: Dict[str, Dict[str, Any]] = {}
        if tools:
            for tool in tools:
                self._register_tool(tool)

    def _register_tool(self, tool: Any) -> None:
        """Register a tool with the server."""
        if hasattr(tool, 'spec'):
            spec = tool.spec
            self._tools[spec.name] = tool
            self._tool_annotations[spec.name] = {
                "name": spec.name,
                "description": spec.description,
                "inputSchema": spec.parameters,
            }

    def handle(self, request: MCPRequest) -> MCPResponse:
        """Handle an MCP request."""
        method = request.method
        
        if method == "initialize":
            return self._handle_initialize(request)
        elif method == "tools/list":
            return self._handle_tools_list(request)
        elif method == "tools/call":
            return self._handle_tools_call(request)
        else:
            return MCPResponse.error_response(
                request.id, METHOD_NOT_FOUND, f"Method not found: {method}"
            )

    def _handle_initialize(self, request: MCPRequest) -> MCPResponse:
        """Handle initialize request."""
        return MCPResponse(
            result={
                "protocolVersion": "2025-03-26",
                "capabilities": {},
                "serverInfo": {"name": "mcp_master", "version": "1.0.0"},
            },
            id=request.id,
        )

    def _handle_tools_list(self, request: MCPRequest) -> MCPResponse:
        """Handle tools/list request."""
        tools = []
        for name, annotations in self._tool_annotations.items():
            tools.append(annotations)
        return MCPResponse(result={"tools": tools}, id=request.id)

    def _handle_tools_call(self, request: MCPRequest) -> MCPResponse:
        """Handle tools/call request."""
        params = request.params
        tool_name = params.get("name", "")
        arguments = params.get("arguments", {})

        if tool_name not in self._tools:
            return MCPResponse.error_response(
                request.id, METHOD_NOT_FOUND, f"Tool not found: {tool_name}"
            )

        tool = self._tools[tool_name]
        try:
            result = tool.execute(**arguments)
            if isinstance(result, ToolResult):
                return MCPResponse(
                    result={
                        "content": [{"type": "text", "text": result.content}],
                        "isError": not result.success,
                    },
                    id=request.id,
                )
            else:
                return MCPResponse(
                    result={"content": [{"type": "text", "text": str(result)}], "isError": False},
                    id=request.id,
                )
        except Exception as exc:
            return MCPResponse.error_response(
                request.id, INTERNAL_ERROR, str(exc)
            )


# ---------------------------------------------------------------------------
# MCP Client Adapter
# ---------------------------------------------------------------------------

class MCPClientAdapter:
    """Client that communicates with an MCP server via a transport.
    
    Integrates OpenJarvis MCP client into mcp_master ecosystem.
    """

    def __init__(self, transport: MCPTransport) -> None:
        self._transport = transport
        self._initialized = False
        self._capabilities: Dict[str, Any] = {}
        self._id_counter = 0

    def _next_id(self) -> int:
        self._id_counter += 1
        return self._id_counter

    def _send(self, method: str, params: Dict[str, Any] | None = None) -> MCPResponse:
        """Send a request and check for errors."""
        request = MCPRequest(
            method=method,
            params=params or {},
            id=self._next_id(),
        )
        response = self._transport.send(request)
        if response.error is not None:
            raise MCPError(
                code=response.error.get("code", -1),
                message=response.error.get("message", "Unknown error"),
                data=response.error.get("data"),
            )
        return response

    def initialize(self) -> Dict[str, Any]:
        """Perform the MCP initialize handshake."""
        params = {
            "protocolVersion": "2025-03-26",
            "capabilities": {},
            "clientInfo": {"name": "mcp_master", "version": "1.0.0"},
        }
        response = self._send("initialize", params)
        self._initialized = True
        self._capabilities = response.result.get("capabilities", {})
        self.notify("notifications/initialized")
        return response.result

    def notify(self, method: str, params: Dict[str, Any] | None = None) -> None:
        """Send a JSON-RPC notification."""
        request = MCPRequest(
            method=method,
            params=params or {},
            id=None,
        )
        self._transport.send_notification(request)

    def list_tools(self) -> List[ToolSpec]:
        """Discover available tools from the server."""
        response = self._send("tools/list")
        tools = response.result.get("tools", [])
        return [
            ToolSpec(
                name=t["name"],
                description=t.get("description", ""),
                parameters=t.get("inputSchema", {}),
            )
            for t in tools
        ]

    def call_tool(self, name: str, arguments: Dict[str, Any] | None = None) -> Dict[str, Any]:
        """Call a tool on the server."""
        response = self._send(
            "tools/call",
            {"name": name, "arguments": arguments or {}},
        )
        return response.result

    def close(self) -> None:
        """Close the transport connection."""
        self._transport.close()

    def __enter__(self) -> "MCPClientAdapter":
        return self

    def __exit__(self, *exc: Any) -> None:
        self.close()


# ---------------------------------------------------------------------------
# Integration with mcp_master ecosystem
# ---------------------------------------------------------------------------

class OpenJarvisIntegration:
    """Main integration class for OpenJarvis capabilities into mcp_master."""

    def __init__(self, registry_path: str = "../registry/tool_registry.json"):
        self.registry_path = registry_path
        self.server = MCPServerAdapter()
        self.transport: Optional[MCPTransport] = None
        self.client: Optional[MCPClientAdapter] = None

    def start_server(self, tools: Optional[List[Any]] = None) -> None:
        """Start the MCP server with given tools."""
        if tools:
            for tool in tools:
                self.server._register_tool(tool)
        logger.info("OpenJarvis MCP server started")

    def connect_stdio(self, command: List[str]) -> MCPClientAdapter:
        """Connect to an MCP server via stdio transport."""
        self.transport = StdioTransport(command)
        self.client = MCPClientAdapter(self.transport)
        self.client.initialize()
        return self.client

    def connect_inprocess(self) -> MCPClientAdapter:
        """Connect to the in-process server."""
        self.transport = InProcessTransport(self.server)
        self.client = MCPClientAdapter(self.transport)
        self.client.initialize()
        return self.client

    def discover_tools(self) -> List[ToolSpec]:
        """Discover tools from the connected server."""
        if not self.client:
            raise RuntimeError("No client connected")
        return self.client.list_tools()

    def execute_tool(self, name: str, **kwargs: Any) -> Dict[str, Any]:
        """Execute a tool via the connected client."""
        if not self.client:
            raise RuntimeError("No client connected")
        return self.client.call_tool(name, kwargs)

    def close(self) -> None:
        """Close all connections."""
        if self.client:
            self.client.close()
            self.client = None
        if self.transport:
            self.transport.close()
            self.transport = None


# ---------------------------------------------------------------------------
# Export
# ---------------------------------------------------------------------------

__all__ = [
    "MCPRequest",
    "MCPResponse",
    "MCPError",
    "MCPTransport",
    "InProcessTransport",
    "StdioTransport",
    "MCPServerAdapter",
    "MCPClientAdapter",
    "ToolSpec",
    "ToolResult",
    "OpenJarvisIntegration",
    "PARSE_ERROR",
    "INVALID_REQUEST",
    "METHOD_NOT_FOUND",
    "INVALID_PARAMS",
    "INTERNAL_ERROR",
]