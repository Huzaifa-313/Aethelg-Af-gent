# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\commands\diff\index.ts
# Merge Date: 2026-05-07T19:14:30.875455
# ---

import type { Command } from '../../commands.js'

export default {
  type: 'local-jsx',
  name: 'diff',
  description: 'View uncommitted changes and per-turn diffs',
  load: () => import('./diff.js'),
} satisfies Command
