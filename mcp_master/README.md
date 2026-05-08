# Mahoraga - Autonomous Self-Healing MCP Server

> **Codename:** Mahoraga  
> **Type:** Autonomous MCP Server with Self-Healing & Security Scanning  
> **Status:** Production Ready (Phase 5 Complete)

## Overview

Mahoraga is a fully autonomous, self-healing MCP (Model Context Protocol) server that transforms the `mcp_master` ecosystem into an intelligent, adaptive platform. It autonomously hunts for new tools on GitHub, heals failing tools through pattern learning, and protects against executable threats.

**Key Capabilities:**
- 🔍 **Autonomous Tool Hunting** - Discovers and integrates MCP-compatible tools from GitHub
- 🏥 **Self-Healing Engine** - Detects failures, learns patterns, and auto-remediates
- 🛡️ **Security Scanning** - Signature and heuristic malware detection for executables
- 🔌 **MCP Protocol Compliance** - Standard `tools/list`, `tools/call`, `resources/list` endpoints
- 📊 **Health Monitoring** - Real-time status, adaptations log, and alerting

## Architecture

```
mcp_master/
├── _mahoraga_sys/              # Mahoraga system files
│   ├── tool_inventory.json     # Tracked tools database
│   ├── adaptation_log.yaml     # Self-healing patterns
│   ├── quarantine_log.txt      # Security events log
│   └── scan_mcp_master.py     # Inventory scanner
├── hunter/                     # GitHub tool hunting
│   ├── github_client.py        # GitHub API integration
│   ├── analyzer.py             # MCP compatibility checker
│   └── ingestor.py             # Tool integration engine
├── self_healing/              # Self-healing system
│   ├── engine.py               # Failure detection & rollback
│   ├── pattern_learner.py      # Adaptive pattern learning
│   └── rollback_manager.py     # Snapshot-based recovery
├── security/                   # Security scanning
│   ├── scanner.py              # Signature & heuristic scanners
│   ├── quarantine.py           # Threat isolation
│   └── regenerator.py          # Safe file recovery
├── mcp_protocol/              # MCP compliance layer
│   ├── server.py               # Main MCP server (stdio transport)
│   ├── tool_exposer.py         # Tool discovery & execution
│   └── health_endpoint.py      # Health/status API
├── core_tools/                 # Built-in MCP tools
├── custom_tools/               # Integrated third-party tools
└── agent_tools/                # Agent-specific tools
```

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js (for Node-based MCP tools)
- Go (for Go-based MCP tools)

### Installation

```bash
cd mcp_master
pip install -r requirements.txt  # If available
```

### Running the Server

Mahoraga uses **stdio transport** (standard for MCP):

```bash
cd mcp_master
python -m mcp_protocol.server
```

Or directly:

```bash
python mcp_master/mcp_protocol/server.py
```

### Connecting an Agent

Any MCP-compatible agent can connect to Mahoraga. Example using the MCP protocol:

**Initialize:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05"
  }
}
```

**List Tools:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}
```

**Call a Tool:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "tool_name",
    "arguments": {}
  }
}
```

## Features

### 1. Autonomous Tool Hunting

Mahoraga can hunt for new MCP tools on GitHub:

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "mahoraga/hunt",
  "params": {
    "query": "mcp server database",
    "max_results": 10
  }
}
```

The hunter:
- Searches GitHub for MCP-compatible repositories
- Analyzes code for MCP compliance (manifest.json, tool schemas)
- Scores tools by relevance (stars, recency, keywords)
- Auto-ingests valid tools into the inventory

### 2. Self-Healing Engine

When a tool fails, Mahoraga automatically:

1. **Detects the failure** (exception, timeout, bad output)
2. **Creates a failure signature** (hash of tool + error pattern)
3. **Learns from patterns** (stores successful fixes in YAML)
4. **Rolls back to snapshot** (if available)
5. **Regenerates files** (using security regenerator)

Access self-healing status:
```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "mahoraga/heal",
  "params": {
    "tool": "optional_tool_name"
  }
}
```

### 3. Security Scanning

Mahoraga protects against executable threats:

- **Signature Scanning**: Detects known malware patterns (eval/base64, os.system, shellcode, etc.)
- **Heuristic Scanning**: Identifies suspicious behaviors (network calls, persistence, obfuscation)
- **Quarantine**: Isolates threats in `_mahoraga_sys/quarantine/`
- **Regeneration**: Restores safe versions of quarantined files

Trigger a security scan:
```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "method": "mahoraga/scan",
  "params": {
    "path": "mcp_master/custom_tools"
  }
}
```

### 4. MCP Protocol Compliance

Mahoraga implements the full MCP specification:

| Method | Description |
|--------|-------------|
| `initialize` | Server capabilities handshake |
| `tools/list` | List all available tools with JSON schemas |
| `tools/call` | Execute a specific tool |
| `resources/list` | List available resources (health, inventory, etc.) |
| `resources/read` | Read a specific resource |
| `prompts/list` | List available prompt templates |
| `health/check` | Mahoraga-specific health endpoint |
| `mahoraga/hunt` | Hunt for new tools on GitHub |
| `mahoraga/scan` | Scan for security threats |
| `mahoraga/heal` | Trigger self-healing |

### 5. Health Monitoring

Check Mahoraga's health status:

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "health/check"
}
```

Returns:
- Server status and uptime
- Tool inventory summary
- Recent self-healing adaptations
- Active security alerts
- System metrics

## Configuration

Mahoraga can be configured via JSON config file:

```json
{
  "port": 8080,
  "host": "localhost",
  "debug": false,
  "max_tools": 1000,
  "enable_hunter": true,
  "enable_security": true,
  "enable_self_healing": true
}
```

Pass config path when starting server:
```python
from mcp_protocol.server import MCPServer
server = MCPServer(config_path="config.json")
server.run_stdio()
```

## Integration Examples

### With Aethelgard Agent

```python
# Aethelgard can connect to Mahoraga via MCP protocol
from aethelgard.mcp_client import MCPClient

client = MCPClient(transport="stdio", command=["python", "mcp_master/mcp_protocol/server.py"])
client.initialize()

# List available tools
tools = client.list_tools()

# Call a tool
result = client.call_tool("database_query", {"sql": "SELECT * FROM users"})
```

### With Claude Desktop

Add to Claude Desktop config:
```json
{
  "mcpServers": {
    "mahoraga": {
      "command": "python",
      "args": ["mcp_master/mcp_protocol/server.py"]
    }
  }
}
```

## File Protection

Mahoraga protects **executable files only**:
- ✅ `.exe`, `.dll`, `.so`, `.pyd` (binaries)
- ✅ `.py`, `.js`, `.go`, `.rs` (scripts - code injection risk)
- ❌ `.md`, `.txt`, `.json`, `.yaml` (text content - NOT scanned)

This ensures documentation and configuration files are never falsely flagged.

## Logs and Reports

### Tracking Files (in `_mahoraga_sys/`)

- **tool_inventory.json** - All discovered and ingested tools
- **adaptation_log.yaml** - Self-healing pattern history
- **quarantine_log.txt** - Security quarantine events
- **server_report.md** - Generated system report (Phase 5)

### Log Formats

**Adaptation Log (YAML):**
```yaml
- timestamp: 2026-05-07T15:30:00Z
  tool: database_tool
  failure_signature: abc123...
  action: rollback
  success: true
```

**Quarantine Log (Text):**
```
[2026-05-07 15:30:00] QUARANTINED: suspicious_file.exe
  Threat: Known malware signature detected
  Action: Moved to quarantine/
```

## Development

### Running Tests

```bash
cd mcp_master
python -m pytest tests/
```

### Adding New Tools

1. Place tool in `custom_tools/` or `agent_tools/`
2. Ensure it has a `manifest.json` with MCP schema
3. Run inventory scan or let Mahoraga auto-discover it

### Extending Mahoraga

- **New scanners**: Add to `security/scanner.py`
- **New healing strategies**: Extend `self_healing/engine.py`
- **New hunter sources**: Extend `hunter/github_client.py`

## Limitations

- HTTP transport not yet implemented (stdio only)
- GitHub API rate limiting (unauthenticated: 60 req/hour)
- Go tool execution requires `go` in PATH
- Node tool execution requires `node` in PATH

## License

This project is part of the `mcp_master` ecosystem. See main LICENSE file.

## Version History

- **v1.0.0** (2026-05-07) - Initial release with full Phase 0-5 implementation
  - Autonomous GitHub tool hunting
  - Self-healing with pattern learning
  - Security scanning and quarantine
  - Full MCP protocol compliance

---

**Mahoraga** - *The adaptive shield for your MCP ecosystem.*
