# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\resume\index.ts
# Merge Date: 2026-05-07T19:16:38.523455
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


