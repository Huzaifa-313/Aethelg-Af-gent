# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\mcp\index.ts
# Merge Date: 2026-05-07T19:16:36.923455
# ---

import type { Command } from '../../commands.js'

const mcp = {
  type: 'local-jsx',
  name: 'mcp',
  description: 'Manage MCP servers',
  immediate: true,
  argumentHint: '[enable|disable [server-name]]',
  load: () => import('./mcp.js'),
} satisfies Command

export default mcp


