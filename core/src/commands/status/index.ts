# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\status\index.ts
# Merge Date: 2026-05-07T19:16:38.919457
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


