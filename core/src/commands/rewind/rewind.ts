# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\rewind\rewind.ts
# Merge Date: 2026-05-07T19:16:38.718458
# ---

import type { LocalCommandResult } from '../../commands.js'
import type { ToolUseContext } from '../../Tool.js'

export async function call(
  _args: string,
  context: ToolUseContext,
): Promise<LocalCommandResult> {
  if (context.openMessageSelector) {
    context.openMessageSelector()
  }
  // Return a skip message to not append any messages.
  return { type: 'skip' }
}


