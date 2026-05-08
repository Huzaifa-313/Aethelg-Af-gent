# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\commands\stats\index.ts
# Merge Date: 2026-05-07T19:17:58.363124
# ---

import type { Command } from '../../commands.js'

const stats = {
  type: 'local-jsx',
  name: 'stats',
  description: 'Show your Claude Code usage statistics and activity',
  load: () => import('./stats.js'),
} satisfies Command

export default stats
