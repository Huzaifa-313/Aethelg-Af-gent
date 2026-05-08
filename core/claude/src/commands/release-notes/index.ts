# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\commands\release-notes\index.ts
# Merge Date: 2026-05-07T19:14:33.177457
# ---

import type { Command } from '../../commands.js'

const releaseNotes: Command = {
  description: 'View release notes',
  name: 'release-notes',
  type: 'local',
  supportsNonInteractive: true,
  load: () => import('./release-notes.js'),
}

export default releaseNotes
