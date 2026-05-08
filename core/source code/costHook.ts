# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\costHook.ts
# Merge Date: 2026-05-07T19:15:25.047455
# ---

// https://github.com/AnukarOP

import { useEffect } from 'react'
import { formatTotalCost, saveCurrentSessionCosts } from './cost-tracker.js'
import { hasConsoleBillingAccess } from './utils/billing.js'
import type { FpsMetrics } from './utils/fpsTracker.js'

export function useCostSummary(
  getFpsMetrics?: () => FpsMetrics | undefined,
): void {
  useEffect(() => {
    const f = () => {
      if (hasConsoleBillingAccess()) {
        process.stdout.write('\n' + formatTotalCost() + '\n')
      }

      saveCurrentSessionCosts(getFpsMetrics?.())
    }
    process.on('exit', f)
    return () => {
      process.off('exit', f)
    }
  }, [])
}
