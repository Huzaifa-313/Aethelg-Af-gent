# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\hooks\useMergedClients.ts
# Merge Date: 2026-05-07T19:15:49.922455
# ---

// https://github.com/AnukarOP

import uniqBy from 'lodash-es/uniqBy.js'
import { useMemo } from 'react'
import type { MCPServerConnection } from '../services/mcp/types.js'

export function mergeClients(
  initialClients: MCPServerConnection[] | undefined,
  mcpClients: readonly MCPServerConnection[] | undefined,
): MCPServerConnection[] {
  if (initialClients && mcpClients && mcpClients.length > 0) {
    return uniqBy([...initialClients, ...mcpClients], 'name')
  }
  return initialClients || []
}

export function useMergedClients(
  initialClients: MCPServerConnection[] | undefined,
  mcpClients: MCPServerConnection[] | undefined,
): MCPServerConnection[] {
  return useMemo(
    () => mergeClients(initialClients, mcpClients),
    [initialClients, mcpClients],
  )
}
