# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\export\index.ts
# Merge Date: 2026-05-07T19:16:35.872453
# ---

import type { Command } from '../../commands.js'

const exportCommand = {
  type: 'local-jsx',
  name: 'export',
  description: 'Export the current conversation to a file or clipboard',
  argumentHint: '[filename]',
  load: () => import('./export.js'),
} satisfies Command

export default exportCommand


