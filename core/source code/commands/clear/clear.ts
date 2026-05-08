# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\commands\clear\clear.ts
# Merge Date: 2026-05-07T19:15:28.186455
# ---

// https://github.com/AnukarOP

import type { LocalCommandCall } from '../../types/command.js'
import { clearConversation } from './conversation.js'

export const call: LocalCommandCall = async (_, context) => {
  await clearConversation(context)
  return { type: 'text', value: '' }
}
