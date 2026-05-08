# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\vim\index.ts
# Merge Date: 2026-05-07T19:16:39.329454
# ---

import type { Command } from '../../commands.js'

const command = {
  name: 'vim',
  description: 'Toggle between Vim and Normal editing modes',
  supportsNonInteractive: false,
  type: 'local',
  load: () => import('./vim.js'),
} satisfies Command

export default command


