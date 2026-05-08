# AETHELGARD MERGED FILE
# Origin Repository: everything-claude-code-main
# Original Path: .cursor\hooks\before-mcp-execution.js
# Merge Date: 2026-05-07T19:19:56.908688
# ---

#!/usr/bin/env node
const { readStdin } = require('./adapter');
readStdin().then(raw => {
  try {
    const input = JSON.parse(raw);
    const server = input.server || input.mcp_server || 'unknown';
    const tool = input.tool || input.mcp_tool || 'unknown';
    console.error(`[ECC] MCP invocation: ${server}/${tool}`);
  } catch {}
  process.stdout.write(raw);
}).catch(() => process.exit(0));
