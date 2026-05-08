# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\tools\ReadMcpResourceTool\prompt.ts
# Merge Date: 2026-05-07T19:19:38.553690
# ---

export const DESCRIPTION = `
Reads a specific resource from an MCP server.
- server: The name of the MCP server to read from
- uri: The URI of the resource to read

Usage examples:
- Read a resource from a server: \`readMcpResource({ server: "myserver", uri: "my-resource-uri" })\`
`

export const PROMPT = `
Reads a specific resource from an MCP server, identified by server name and resource URI.

Parameters:
- server (required): The name of the MCP server from which to read the resource
- uri (required): The URI of the resource to read
`
