# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\hooks\useMergedCommands.ts
# Merge Date: 2026-05-07T19:15:49.945455
# ---

// https://github.com/AnukarOP

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
