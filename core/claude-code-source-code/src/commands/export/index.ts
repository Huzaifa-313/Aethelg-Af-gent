# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\commands\export\index.ts
# Merge Date: 2026-05-07T19:17:55.684123
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
