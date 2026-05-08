# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\commands\btw\index.ts
# Merge Date: 2026-05-07T19:17:55.113126
# ---

import type { Command } from '../../commands.js'

const btw = {
  type: 'local-jsx',
  name: 'btw',
  description:
    'Ask a quick side question without interrupting the main conversation',
  immediate: true,
  argumentHint: '<question>',
  load: () => import('./btw.js'),
} satisfies Command

export default btw
