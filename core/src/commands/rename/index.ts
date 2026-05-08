# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\rename\index.ts
# Merge Date: 2026-05-07T19:16:38.453458
# ---

import type { Command } from '../../commands.js'

const rename = {
  type: 'local-jsx',
  name: 'rename',
  description: 'Rename the current conversation',
  immediate: true,
  argumentHint: '[name]',
  load: () => import('./rename.js'),
} satisfies Command

export default rename


