# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\commands\review\ultrareviewEnabled.ts
# Merge Date: 2026-05-07T19:17:58.148124
# ---

import { getFeatureValue_CACHED_MAY_BE_STALE } from '../../services/analytics/growthbook.js'

/**
 * Runtime gate for /ultrareview. GB config's `enabled` field controls
 * visibility — isEnabled() on the command filters it from getCommands()
 * when false, so ungated users don't see the command at all.
 */
export function isUltrareviewEnabled(): boolean {
  const cfg = getFeatureValue_CACHED_MAY_BE_STALE<Record<
    string,
    unknown
  > | null>('tengu_review_bughunter_config', null)
  return cfg?.enabled === true
}
