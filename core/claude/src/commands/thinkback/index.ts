# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\commands\thinkback\index.ts
# Merge Date: 2026-05-07T19:14:34.102458
# ---

import type { Command } from '../../commands.js'
import { checkStatsigFeatureGate_CACHED_MAY_BE_STALE } from '../../services/analytics/growthbook.js'

const thinkback = {
  type: 'local-jsx',
  name: 'think-back',
  description: 'Your 2025 Claude Code Year in Review',
  isEnabled: () =>
    checkStatsigFeatureGate_CACHED_MAY_BE_STALE('tengu_thinkback'),
  load: () => import('./thinkback.js'),
} satisfies Command

export default thinkback
