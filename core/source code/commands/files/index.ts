# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\commands\files\index.ts
# Merge Date: 2026-05-07T19:15:28.955457
# ---

// https://github.com/AnukarOP

import type { Command } from '../../commands.js'

const files = {
  type: 'local',
  name: 'files',
  description: 'List all files currently in context',
  isEnabled: () => process.env.USER_TYPE === 'ant',
  supportsNonInteractive: true,
  load: () => import('./files.js'),
} satisfies Command

export default files
