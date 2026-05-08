# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\usage\index.ts
# Merge Date: 2026-05-07T19:16:39.294456
# ---

import type { Command } from '../../commands.js'

export default {
  type: 'local-jsx',
  name: 'usage',
  description: 'Show plan usage limits',
  availability: ['claude-ai'],
  load: () => import('./usage.js'),
} satisfies Command


