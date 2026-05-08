# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\services\compact\compactWarningHook.ts
# Merge Date: 2026-05-07T19:15:59.342475
# ---

// https://github.com/AnukarOP

import { useSyncExternalStore } from 'react'
import { compactWarningStore } from './compactWarningState.js'

/**
 * React hook to subscribe to compact warning suppression state.
 *
 * Lives in its own file so that compactWarningState.ts stays React-free:
 * microCompact.ts imports the pure state functions, and pulling React into
 * that module graph would drag it into the print-mode startup path.
 */
export function useCompactWarningSuppression(): boolean {
  return useSyncExternalStore(
    compactWarningStore.subscribe,
    compactWarningStore.getState,
  )
}
