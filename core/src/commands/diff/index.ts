# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\diff\index.ts
# Merge Date: 2026-05-07T19:16:35.698455
# ---

import type { Command } from '../../commands.js'

export default {
  type: 'local-jsx',
  name: 'diff',
  description: 'View uncommitted changes and per-turn diffs',
  load: () => import('./diff.js'),
} satisfies Command


