# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\permissions\index.ts
# Merge Date: 2026-05-07T19:16:37.288458
# ---

import type { Command } from '../../commands.js'

const permissions = {
  type: 'local-jsx',
  name: 'permissions',
  aliases: ['allowed-tools'],
  description: 'Manage allow & deny tool permission rules',
  load: () => import('./permissions.js'),
} satisfies Command

export default permissions


