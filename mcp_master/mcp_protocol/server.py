"""
MCPServer - Standalone MCP Protocol Server for Mahoraga
Implements standard MCP protocol with tools/list, tools/call, resources/list handlers.
Any MCP-compatible agent (Aethelgard, Claude, etc.) can connect to this server.
"""

import json
import logging
import os
import sys
from typing import Any, Dict, List, Optional
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from mcp_protocol.tool_exposer import ToolExposer
from mcp_protocol.health_endpoint import HealthEndpoint
from hunter.github_client import GitHubClient
from hunter.analyzer import RepoAnalyzer
from hunter.ingestor import ToolIngestor
from self_healing.engine import SelfHealingEngine
from security.scanner import SignatureScanner, HeuristicScanner
from security.quarantine import QuarantineManager

logger = logging.getLogger(__name__)


class MCPServer:
    """
    Standalone MCP Protocol Server for Mahoraga.
    
    Implements the Model Context Protocol (MCP) specification:
    - tools/list: List all available tools
    - tools/call: Execute a specific tool
    - resources/list: List available resources
    - resources/read: Read a specific resource
    - prompts/list: List available prompts
    - initialization: Server capabilities handshake
    """
    
    def __init__(self, config_path: Optional[str] = None):
        """Initialize the MCP server with all Mahoraga components."""
        self.config = self._load_config(config_path)
        self.mcp_master_path = Path(__file__).parent.parent
        self.tool_exposer = ToolExposer()
        self.health_endpoint = HealthEndpoint()
        
        # Initialize Mahoraga components
        self.github_client = GitHubClient()
        self.repo_analyzer = RepoAnalyzer(self.mcp_master_path)
        self.tool_ingestor = ToolIngestor()
        self.self_healing = SelfHealingEngine()
        self.sig_scanner = SignatureScanner()
        self.heuristic_scanner = HeuristicScanner()
        self.quarantine_mgr = QuarantineManager()
        
        # Server state
        self.initialized = False
        self.server_info = {
            "name": "mahoraga",
            "version": "1.0.0",
            "description": "Autonomous Self-Healing MCP Server with GitHub Tool Hunting and Security Scanning"
        }
        
        logger.info("Mahoraga MCP Server initialized")
    
    def _load_config(self, config_path: Optional[str]) -> Dict[str, Any]:
        """Load server configuration."""
        default_config = {
            "port": 8080,
            "host": "localhost",
            "debug": False,
            "max_tools": 1000,
            "enable_hunter": True,
            "enable_security": True,
            "enable_self_healing": True
        }
        
        if config_path and os.path.exists(config_path):
            try:
                with open(config_path, 'r') as f:
                    user_config = json.load(f)
                    default_config.update(user_config)
            except Exception as e:
                logger.error(f"Failed to load config from {config_path}: {e}")
        
        return default_config
    
    def handle_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main request handler for MCP protocol.
        
        Routes requests to appropriate handlers based on method.
        """
        method = request.get("method")
        params = request.get("params", {})
        request_id = request.get("id")
        
        try:
            if method == "initialize":
                response = self._handle_initialize(params)
            elif method == "tools/list":
                response = self._handle_tools_list(params)
            elif method == "tools/call":
                response = self._handle_tools_call(params)
            elif method == "resources/list":
                response = self._handle_resources_list(params)
            elif method == "resources/read":
                response = self._handle_resources_read(params)
            elif method == "prompts/list":
                response = self._handle_prompts_list(params)
            elif method == "health/check":
                response = self._handle_health_check(params)
            elif method == "mahoraga/hunt":
                response = self._handle_mahoraga_hunt(params)
            elif method == "mahoraga/scan":
                response = self._handle_mahoraga_scan(params)
            elif method == "mahoraga/heal":
                response = self._handle_mahoraga_heal(params)
            else:
                response = {
                    "error": {
                        "code": -32601,
                        "message": f"Method not found: {method}"
                    }
                }
            
            return self._format_response(response, request_id)
            
        except Exception as e:
            logger.error(f"Error handling request {method}: {e}")
            return self._format_error_response(str(e), request_id)
    
    def _handle_initialize(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle MCP initialization handshake."""
        self.initialized = True
        
        return {
            "protocolVersion": "2024-11-05",
            "serverInfo": self.server_info,
            "capabilities": {
                "tools": {
                    "listChanged": True
                },
                "resources": {
                    "subscribe": False,
                    "listChanged": True
                },
                "prompts": {
                    "listChanged": False
                }
            }
        }
    
    def _handle_tools_list(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle tools/list request - expose all Mahoraga tools."""
        if not self.initialized:
            raise ValueError("Server not initialized")
        
        tools = self.tool_exposer.get_all_tools()
        
        return {
            "tools": tools
        }
    
    def _handle_tools_call(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle tools/call request - execute a specific tool."""
        if not self.initialized:
            raise ValueError("Server not initialized")
        
        tool_name = params.get("name")
        arguments = params.get("arguments", {})
        
        if not tool_name:
            raise ValueError("Tool name is required")
        
        # Execute tool through tool exposer
        result = self.tool_exposer.call_tool(tool_name, arguments)
        
        return {
            "content": [
                {
                    "type": "text",
                    "text": json.dumps(result, indent=2)
                }
            ],
            "isError": False
        }
    
    def _handle_resources_list(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle resources/list request."""
        resources = [
            {
                "uri": "mahoraga://health",
                "name": "Mahoraga Health Status",
                "description": "Current health and status of Mahoraga server",
                "mimeType": "application/json"
            },
            {
                "uri": "mahoraga://inventory",
                "name": "Tool Inventory",
                "description": "List of all ingested tools",
                "mimeType": "application/json"
            },
            {
                "uri": "mahoraga://adaptations",
                "name": "Self-Healing Adaptations",
                "description": "Log of self-healing pattern adaptations",
                "mimeType": "text/yaml"
            },
            {
                "uri": "mahoraga://quarantine",
                "name": "Quarantine Log",
                "description": "Log of quarantined files",
                "mimeType": "text/plain"
            }
        ]
        
        return {"resources": resources}
    
    def _handle_resources_read(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle resources/read request."""
        uri = params.get("uri")
        
        if uri == "mahoraga://health":
            content = self.health_endpoint.get_health_status()
        elif uri == "mahoraga://inventory":
            content = self.tool_exposer.get_inventory_report()
        elif uri == "mahoraga://adaptations":
            content = self.self_healing.get_adaptation_log()
        elif uri == "mahoraga://quarantine":
            content = self.quarantine_mgr.get_quarantine_log()
        else:
            raise ValueError(f"Unknown resource URI: {uri}")
        
        return {
            "contents": [
                {
                    "uri": uri,
                    "mimeType": "application/json" if uri.endswith(".json") else "text/plain",
                    "text": json.dumps(content, indent=2) if isinstance(content, (dict, list)) else content
                }
            ]
        }
    
    def _handle_prompts_list(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle prompts/list request."""
        prompts = [
            {
                "name": "mahoraga_hunt_tools",
                "description": "Hunt for new MCP tools on GitHub",
                "arguments": [
                    {
                        "name": "query",
                        "description": "Search query for GitHub",
                        "required": True
                    }
                ]
            },
            {
                "name": "mahoraga_scan_tools",
                "description": "Scan tools for security threats",
                "arguments": []
            }
        ]
        
        return {"prompts": prompts}
    
    def _handle_health_check(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle health/check request."""
        return self.health_endpoint.get_health_status()
    
    def _handle_mahoraga_hunt(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle mahoraga/hunt request - hunt for new tools."""
        query = params.get("query", "mcp server")
        max_results = params.get("max_results", 10)
        
        try:
            # Search GitHub for MCP tools
            results = self.github_client.search_mcp_tools(query)
            
            # Analyze and ingest top results
            ingested = []
            for repo in results[:max_results]:
                analysis = self.repo_analyzer.analyze(repo)
                if analysis.get("mcp_compatible"):
                    tool_info = self.tool_ingestor.ingest_repository(repo, analysis)
                    ingested.append(tool_info)
            
            return {
                "status": "success",
                "searched": len(results),
                "ingested": len(ingested),
                "tools": ingested
            }
        except Exception as e:
            logger.error(f"Hunt failed: {e}")
            return {"status": "error", "message": str(e)}
    
    def _handle_mahoraga_scan(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle mahoraga/scan request - scan for threats."""
        target_path = params.get("path", "mcp_master")
        
        try:
            threats = []
            
            # Walk through target directory
            for root, dirs, files in os.walk(target_path):
                for file in files:
                    filepath = os.path.join(root, file)
                    
                    # Signature scan
                    sig_result = self.sig_scanner.scan_file(filepath)
                    if sig_result.get("infected"):
                        threats.append(sig_result)
                        self.quarantine_mgr.quarantine_file(filepath, sig_result)
                    
                    # Heuristic scan
                    heur_result = self.heuristic_scanner.scan_file(filepath)
                    if heur_result.get("suspicious"):
                        threats.append(heur_result)
            
            return {
                "status": "success",
                "scanned": target_path,
                "threats_found": len(threats),
                "threats": threats
            }
        except Exception as e:
            logger.error(f"Scan failed: {e}")
            return {"status": "error", "message": str(e)}
    
    def _handle_mahoraga_heal(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle mahoraga/heal request - trigger self-healing."""
        tool_name = params.get("tool")
        
        try:
            if tool_name:
                result = self.self_healing.heal_tool(tool_name)
            else:
                result = self.self_healing.heal_all()
            
            return {
                "status": "success",
                "healing_result": result
            }
        except Exception as e:
            logger.error(f"Healing failed: {e}")
            return {"status": "error", "message": str(e)}
    
    def _format_response(self, result: Dict[str, Any], request_id: Any) -> Dict[str, Any]:
        """Format successful response."""
        return {
            "jsonrpc": "2.0",
            "id": request_id,
            "result": result
        }
    
    def _format_error_response(self, error_message: str, request_id: Any) -> Dict[str, Any]:
        """Format error response."""
        return {
            "jsonrpc": "2.0",
            "id": request_id,
            "error": {
                "code": -32603,
                "message": error_message
            }
        }
    
    def run_stdio(self):
        """
        Run server using stdio transport (standard for MCP).
        Reads JSON-RPC messages from stdin, writes responses to stdout.
        """
        logger.info("Starting Mahoraga MCP Server on stdio transport")
        
        for line in sys.stdin:
            try:
                request = json.loads(line.strip())
                response = self.handle_request(request)
                print(json.dumps(response), flush=True)
            except json.JSONDecodeError:
                error_response = self._format_error_response("Invalid JSON", None)
                print(json.dumps(error_response), flush=True)
            except Exception as e:
                error_response = self._format_error_response(str(e), None)
                print(json.dumps(error_response), flush=True)
    
    def run_http(self, host: Optional[str] = None, port: Optional[int] = None):
        """
        Run server using HTTP transport.
        Requires aiohttp or similar - placeholder for future implementation.
        """
        host = host or self.config.get("host", "localhost")
        port = port or self.config.get("port", 8080)
        
        logger.info(f"HTTP transport not yet implemented. Use stdio transport.")
        logger.info(f"Would start server on {host}:{port}")
        raise NotImplementedError("HTTP transport not yet implemented")


if __name__ == "__main__":
    # Setup logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Create and run server
    server = MCPServer()
    server.run_stdio()
