# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\commands\release-notes\index.ts
# Merge Date: 2026-05-07T19:17:57.819127
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
