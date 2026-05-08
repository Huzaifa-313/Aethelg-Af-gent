# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\commands\btw\index.ts
# Merge Date: 2026-05-07T19:15:28.096459
# ---

// https://github.com/AnukarOP

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
