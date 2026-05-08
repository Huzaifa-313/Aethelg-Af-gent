# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\files\index.ts
# Merge Date: 2026-05-07T19:16:36.064456
# ---

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


