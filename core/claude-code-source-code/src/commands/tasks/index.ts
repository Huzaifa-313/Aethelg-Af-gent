# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\commands\tasks\index.ts
# Merge Date: 2026-05-07T19:17:58.507127
# ---

import type { Command } from '../../commands.js'

const tasks = {
  type: 'local-jsx',
  name: 'tasks',
  aliases: ['bashes'],
  description: 'List and manage background tasks',
  load: () => import('./tasks.js'),
} satisfies Command

export default tasks
