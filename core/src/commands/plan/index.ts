# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\plan\index.ts
# Merge Date: 2026-05-07T19:16:37.325455
# ---

import type { Command } from '../../commands.js'

const plan = {
  type: 'local-jsx',
  name: 'plan',
  description: 'Enable plan mode or view the current session plan',
  argumentHint: '[open|<description>]',
  load: () => import('./plan.js'),
} satisfies Command

export default plan


