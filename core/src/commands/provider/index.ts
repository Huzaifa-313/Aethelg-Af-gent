# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: src\commands\provider\index.ts
# Merge Date: 2026-05-07T19:21:49.669305
# ---

import type { Command } from '../../commands.js'

const provider = {
  type: 'local-jsx',
  name: 'provider',
  description: 'Manage API provider profiles',
  load: () => import('./provider.js'),
} satisfies Command

export default provider
