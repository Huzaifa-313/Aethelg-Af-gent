# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\commands\resume\index.ts
# Merge Date: 2026-05-07T19:14:33.408458
# ---

import type { Command } from '../../commands.js'

const resume: Command = {
  type: 'local-jsx',
  name: 'resume',
  description: 'Resume a previous conversation',
  aliases: ['continue'],
  argumentHint: '[conversation id or search term]',
  load: () => import('./resume.js'),
}

export default resume
