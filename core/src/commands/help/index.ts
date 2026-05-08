# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\help\index.ts
# Merge Date: 2026-05-07T19:16:36.133456
# ---

import type { Command } from '../../commands.js'

const help = {
  type: 'local-jsx',
  name: 'help',
  description: 'Show help and available commands',
  load: () => import('./help.js'),
} satisfies Command

export default help


