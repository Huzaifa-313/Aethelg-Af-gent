# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\tag\index.ts
# Merge Date: 2026-05-07T19:16:38.989456
# ---

import type { Command } from '../../commands.js'

const tag = {
  type: 'local-jsx',
  name: 'tag',
  description: 'Toggle a searchable tag on the current session',
  isEnabled: () => process.env.USER_TYPE === 'ant',
  argumentHint: '<tag-name>',
  load: () => import('./tag.js'),
} satisfies Command

export default tag


