# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\utils\autoModeDenials.ts
# Merge Date: 2026-05-07T19:19:40.536689
# ---

/**
 * Tracks commands recently denied by the auto mode classifier.
 * Populated from useCanUseTool.ts, read from RecentDenialsTab.tsx in /permissions.
 */

import { feature } from 'bun:bundle'

export type AutoModeDenial = {
  toolName: string
  /** Human-readable description of the denied command (e.g. bash command string) */
  display: string
  reason: string
  timestamp: number
}

let DENIALS: readonly AutoModeDenial[] = []
const MAX_DENIALS = 20

export function recordAutoModeDenial(denial: AutoModeDenial): void {
  if (!feature('TRANSCRIPT_CLASSIFIER')) return
  DENIALS = [denial, ...DENIALS.slice(0, MAX_DENIALS - 1)]
}

export function getAutoModeDenials(): readonly AutoModeDenial[] {
  return DENIALS
}
