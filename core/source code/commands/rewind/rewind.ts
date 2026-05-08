# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\commands\rewind\rewind.ts
# Merge Date: 2026-05-07T19:15:31.601455
# ---

// https://github.com/AnukarOP

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
