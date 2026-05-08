# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\exit\index.ts
# Merge Date: 2026-05-07T19:16:35.819457
# ---

import type { Command } from '../../commands.js'

const exit = {
  type: 'local-jsx',
  name: 'exit',
  aliases: ['quit'],
  description: 'Exit the REPL',
  immediate: true,
  load: () => import('./exit.js'),
} satisfies Command

export default exit


