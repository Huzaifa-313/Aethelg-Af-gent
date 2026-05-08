# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\agents\index.ts
# Merge Date: 2026-05-07T19:16:34.889455
# ---

import type { Command } from '../../commands.js'

const agents = {
  type: 'local-jsx',
  name: 'agents',
  description: 'Manage agent configurations',
  load: () => import('./agents.js'),
} satisfies Command

export default agents


