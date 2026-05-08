# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\commands\permissions\index.ts
# Merge Date: 2026-05-07T19:14:32.360455
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
