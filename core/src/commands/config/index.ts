# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\config\index.ts
# Merge Date: 2026-05-07T19:16:35.434457
# ---

import type { Command } from '../../commands.js'

const config = {
  aliases: ['settings'],
  type: 'local-jsx',
  name: 'config',
  description: 'Open config panel',
  load: () => import('./config.js'),
} satisfies Command

export default config


