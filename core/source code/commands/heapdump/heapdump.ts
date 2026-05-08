# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\commands\heapdump\heapdump.ts
# Merge Date: 2026-05-07T19:15:28.977454
# ---

// https://github.com/AnukarOP

import { performHeapDump } from '../../utils/heapDumpService.js'

export async function call(): Promise<{ type: 'text'; value: string }> {
  const result = await performHeapDump()

  if (!result.success) {
    return {
      type: 'text',
      value: `Failed to create heap dump: ${result.error}`,
    }
  }

  return {
    type: 'text',
    value: `${result.heapPath}\n${result.diagPath}`,
  }
}
