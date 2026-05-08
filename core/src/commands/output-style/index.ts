# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\output-style\index.ts
# Merge Date: 2026-05-07T19:16:37.208454
# ---

import type { Command } from '../../commands.js'

const outputStyle = {
  type: 'local-jsx',
  name: 'output-style',
  description: 'Deprecated: use /config to change output style',
  isHidden: true,
  load: () => import('./output-style.js'),
} satisfies Command

export default outputStyle


