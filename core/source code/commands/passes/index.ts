# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\commands\passes\index.ts
# Merge Date: 2026-05-07T19:15:30.107458
# ---

// https://github.com/AnukarOP

import type { Command } from '../../commands.js'
import {
  checkCachedPassesEligibility,
  getCachedReferrerReward,
} from '../../services/api/referral.js'

export default {
  type: 'local-jsx',
  name: 'passes',
  get description() {
    const reward = getCachedReferrerReward()
    if (reward) {
      return 'Share a free week of Claude Code with friends and earn extra usage'
    }
    return 'Share a free week of Claude Code with friends'
  },
  get isHidden() {
    const { eligible, hasCache } = checkCachedPassesEligibility()
    return !eligible || !hasCache
  },
  load: () => import('./passes.js'),
} satisfies Command
