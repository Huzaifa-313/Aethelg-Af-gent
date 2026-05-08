# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\add-dir\index.ts
# Merge Date: 2026-05-07T19:16:34.822456
# ---

import type { Command } from '../../commands.js'

const addDir = {
  type: 'local-jsx',
  name: 'add-dir',
  description: 'Add a new working directory',
  argumentHint: '<path>',
  load: () => import('./add-dir.js'),
} satisfies Command

export default addDir


