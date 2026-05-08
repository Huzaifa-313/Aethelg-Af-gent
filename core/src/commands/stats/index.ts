# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\stats\index.ts
# Merge Date: 2026-05-07T19:16:38.882455
# ---

import type { Command } from '../../commands.js'

const stats = {
  type: 'local-jsx',
  name: 'stats',
  description: 'Show your Claude Code usage statistics and activity',
  load: () => import('./stats.js'),
} satisfies Command

export default stats


