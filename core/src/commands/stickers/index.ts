# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\stickers\index.ts
# Merge Date: 2026-05-07T19:16:38.948454
# ---

import type { Command } from '../../commands.js'

const stickers = {
  type: 'local',
  name: 'stickers',
  description: 'Order Claude Code stickers',
  supportsNonInteractive: false,
  load: () => import('./stickers.js'),
} satisfies Command

export default stickers


