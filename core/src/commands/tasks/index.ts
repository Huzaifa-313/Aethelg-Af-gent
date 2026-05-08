# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\tasks\index.ts
# Merge Date: 2026-05-07T19:16:39.047455
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


