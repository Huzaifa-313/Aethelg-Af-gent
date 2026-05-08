# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\clear\clear.ts
# Merge Date: 2026-05-07T19:16:35.263454
# ---

import type { LocalCommandCall } from '../../types/command.js'
import { clearConversation } from './conversation.js'

export const call: LocalCommandCall = async (_, context) => {
  await clearConversation(context)
  return { type: 'text', value: '' }
}


