# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\commands\agents\index.ts
# Merge Date: 2026-05-07T19:19:09.363685
# ---

import type { Command } from '../../commands.js'

const agents = {
  type: 'local-jsx',
  name: 'agents',
  description: 'Manage agent configurations',
  load: () => import('./agents.js'),
} satisfies Command

export default agents
