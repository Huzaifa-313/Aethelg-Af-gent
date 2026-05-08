# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\components\messages\teamMemSaved.ts
# Merge Date: 2026-05-07T19:18:07.692124
# ---

import type { SystemMemorySavedMessage } from '../../types/message.js'

/**
 * Returns the team-memory segment for the memory-saved UI, plus the count so
 * the caller can derive the private count without accessing teamCount itself.
 * Plain function (not a React component) so the React Compiler won't hoist
 * the teamCount property access for memoization. This module is only loaded
 * when feature('TEAMMEM') is true.
 */
export function teamMemSavedPart(
  message: SystemMemorySavedMessage,
): { segment: string; count: number } | null {
  const count = message.teamCount ?? 0
  if (count === 0) return null
  return {
    segment: `${count} team ${count === 1 ? 'memory' : 'memories'}`,
    count,
  }
}
