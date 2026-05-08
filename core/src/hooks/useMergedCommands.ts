# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\hooks\useMergedCommands.ts
# Merge Date: 2026-05-07T19:16:55.533458
# ---

import uniqBy from 'lodash-es/uniqBy.js'
import { useMemo } from 'react'
import type { Command } from '../commands.js'

export function useMergedCommands(
  initialCommands: Command[],
  mcpCommands: Command[],
): Command[] {
  return useMemo(() => {
    if (mcpCommands.length > 0) {
      return uniqBy([...initialCommands, ...mcpCommands], 'name')
    }
    return initialCommands
  }, [initialCommands, mcpCommands])
}

