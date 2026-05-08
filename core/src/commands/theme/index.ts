# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\theme\index.ts
# Merge Date: 2026-05-07T19:16:39.143453
# ---

import type { Command } from '../../commands.js'

const theme = {
  type: 'local-jsx',
  name: 'theme',
  description: 'Change the theme',
  load: () => import('./theme.js'),
} satisfies Command

export default theme


