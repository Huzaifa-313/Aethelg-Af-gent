# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\logout\index.ts
# Merge Date: 2026-05-07T19:16:36.830454
# ---

import type { Command } from '../../commands.js'
import { isEnvTruthy } from '../../utils/envUtils.js'

export default {
  type: 'local-jsx',
  name: 'logout',
  description: 'Sign out from your Anthropic account',
  isEnabled: () => !isEnvTruthy(process.env.DISABLE_LOGOUT_COMMAND),
  load: () => import('./logout.js'),
} satisfies Command


