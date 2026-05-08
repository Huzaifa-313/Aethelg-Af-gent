# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\heapdump\heapdump.ts
# Merge Date: 2026-05-07T19:16:36.085456
# ---

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


