# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\commands\status\index.ts
# Merge Date: 2026-05-07T19:14:33.835455
# ---

import type { Command } from '../../commands.js'

const status = {
  type: 'local-jsx',
  name: 'status',
  description:
    'Show Claude Code status including version, model, account, API connectivity, and tool statuses',
  immediate: true,
  load: () => import('./status.js'),
} satisfies Command

export default status
