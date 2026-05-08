# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: src\commands\wiki\index.ts
# Merge Date: 2026-05-07T19:21:49.778307
# ---

import type { Command } from '../../commands.js'

const wiki = {
  type: 'local-jsx',
  name: 'wiki',
  description: 'Initialize and inspect the OpenClaude project wiki',
  argumentHint: '[init|status]',
  immediate: true,
  load: () => import('./wiki.js'),
} satisfies Command

export default wiki
