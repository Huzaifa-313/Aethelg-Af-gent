# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\utils\model\check1mAccess.ts
# Merge Date: 2026-05-07T19:19:48.530685
# ---

import type { OverageDisabledReason } from 'src/services/claudeAiLimits.js'
import { isClaudeAISubscriber } from '../auth.js'
import { getGlobalConfig } from '../config.js'
import { is1mContextDisabled } from '../context.js'

/**
 * Check if extra usage is enabled based on the cached disabled reason.
 * Extra usage is considered enabled if there's no disabled reason,
 * or if the disabled reason indicates it's provisioned but temporarily unavailable.
 */
function isExtraUsageEnabled(): boolean {
  const reason = getGlobalConfig().cachedExtraUsageDisabledReason
  // undefined = no cache yet, treat as not enabled (conservative)
  if (reason === undefined) {
    return false
  }
  // null = no disabled reason from API, extra usage is enabled
  if (reason === null) {
    return true
  }
  // Check which disabled reasons still mean "provisioned"
  switch (reason as OverageDisabledReason) {
    // Provisioned but credits depleted — still counts as enabled
    case 'out_of_credits':
      return true
    // Not provisioned or actively disabled
    case 'overage_not_provisioned':
    case 'org_level_disabled':
    case 'org_level_disabled_until':
    case 'seat_tier_level_disabled':
    case 'member_level_disabled':
    case 'seat_tier_zero_credit_limit':
    case 'group_zero_credit_limit':
    case 'member_zero_credit_limit':
    case 'org_service_level_disabled':
    case 'org_service_zero_credit_limit':
    case 'no_limits_configured':
    case 'unknown':
      return false
    default:
      return false
  }
}

// @[MODEL LAUNCH]: Add check if the new model supports 1M context
export function checkOpus1mAccess(): boolean {
  if (is1mContextDisabled()) {
    return false
  }

  if (isClaudeAISubscriber()) {
    // Subscribers have access if extra usage is enabled for their account
    return isExtraUsageEnabled()
  }

  // Non-subscribers (API/PAYG) have access
  return true
}

export function checkSonnet1mAccess(): boolean {
  if (is1mContextDisabled()) {
    return false
  }

  if (isClaudeAISubscriber()) {
    // Subscribers have access if extra usage is enabled for their account
    return isExtraUsageEnabled()
  }

  // Non-subscribers (API/PAYG) have access
  return true
}
