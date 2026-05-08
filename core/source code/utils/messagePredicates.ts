# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\utils\messagePredicates.ts
# Merge Date: 2026-05-07T19:16:15.101463
# ---

// https://github.com/AnukarOP

import type { Message, UserMessage } from '../types/message.js'

// tool_result messages share type:'user' with human turns; the discriminant
// is the optional toolUseResult field. Four PRs (#23977, #24016, #24022,
// #24025) independently fixed miscounts from checking type==='user' alone.
export function isHumanTurn(m: Message): m is UserMessage {
  return m.type === 'user' && !m.isMeta && m.toolUseResult === undefined
}
