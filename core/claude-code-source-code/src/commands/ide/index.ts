# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\commands\ide\index.ts
# Merge Date: 2026-05-07T19:17:55.993127
# ---

import type { Command } from '../../commands.js'

const ide = {
  type: 'local-jsx',
  name: 'ide',
  description: 'Manage IDE integrations and show status',
  argumentHint: '[open]',
  load: () => import('./ide.js'),
} satisfies Command

export default ide
