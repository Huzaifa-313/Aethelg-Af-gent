# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\skills\index.ts
# Merge Date: 2026-05-07T19:16:38.847456
# ---

import type { Command } from '../../commands.js'

const skills = {
  type: 'local-jsx',
  name: 'skills',
  description: 'List available skills',
  load: () => import('./skills.js'),
} satisfies Command

export default skills


