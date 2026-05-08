# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\utils\immediateCommand.ts
# Merge Date: 2026-05-07T19:17:21.357587
# ---

import { getFeatureValue_CACHED_MAY_BE_STALE } from '../services/analytics/growthbook.js'

/**
 * Whether inference-config commands (/model, /fast, /effort) should execute
 * immediately (during a running query) rather than waiting for the current
 * turn to finish.
 *
 * Always enabled for ants; gated by experiment for external users.
 */
export function shouldInferenceConfigCommandBeImmediate(): boolean {
  return (
    process.env.USER_TYPE === 'ant' ||
    getFeatureValue_CACHED_MAY_BE_STALE('tengu_immediate_model_command', false)
  )
}

