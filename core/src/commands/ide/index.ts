# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\ide\index.ts
# Merge Date: 2026-05-07T19:16:36.228456
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


