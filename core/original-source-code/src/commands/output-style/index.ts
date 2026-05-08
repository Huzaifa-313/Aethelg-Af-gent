# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\commands\output-style\index.ts
# Merge Date: 2026-05-07T19:19:10.991688
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
