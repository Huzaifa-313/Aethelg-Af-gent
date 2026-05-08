# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\utils\classifierApprovalsHook.ts
# Merge Date: 2026-05-07T19:18:31.724685
# ---

/**
 * React hook for classifierApprovals store.
 * Split from classifierApprovals.ts so pure-state importers (permissions.ts,
 * toolExecution.ts, postCompactCleanup.ts) do not pull React into print.ts.
 */

import { useSyncExternalStore } from 'react'
import {
  isClassifierChecking,
  subscribeClassifierChecking,
} from './classifierApprovals.js'

export function useIsClassifierChecking(toolUseID: string): boolean {
  return useSyncExternalStore(subscribeClassifierChecking, () =>
    isClassifierChecking(toolUseID),
  )
}
