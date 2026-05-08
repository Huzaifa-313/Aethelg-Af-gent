# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\utils\extraUsage.ts
# Merge Date: 2026-05-07T19:16:12.729454
# ---

// https://github.com/AnukarOP

import { isClaudeAISubscriber } from './auth.js'
import { has1mContext } from './context.js'

export function isBilledAsExtraUsage(
  model: string | null,
  isFastMode: boolean,
  isOpus1mMerged: boolean,
): boolean {
  if (!isClaudeAISubscriber()) return false
  if (isFastMode) return true
  if (model === null || !has1mContext(model)) return false

  const m = model
    .toLowerCase()
    .replace(/\[1m\]$/, '')
    .trim()
  const isOpus46 = m === 'opus' || m.includes('opus-4-6')
  const isSonnet46 = m === 'sonnet' || m.includes('sonnet-4-6')

  if (isOpus46 && isOpus1mMerged) return false

  return isOpus46 || isSonnet46
}
