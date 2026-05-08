# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\commands\rewind\rewind.ts
# Merge Date: 2026-05-07T19:19:12.097687
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
