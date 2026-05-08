# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\hooks\index.ts
# Merge Date: 2026-05-07T19:16:36.167458
# ---

import type { Command } from '../../commands.js'

const hooks = {
  type: 'local-jsx',
  name: 'hooks',
  description: 'View hook configurations for tool events',
  immediate: true,
  load: () => import('./hooks.js'),
} satisfies Command

export default hooks


