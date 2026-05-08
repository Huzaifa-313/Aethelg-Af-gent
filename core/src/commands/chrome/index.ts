# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\chrome\index.ts
# Merge Date: 2026-05-07T19:16:35.229456
# ---

import { getIsNonInteractiveSession } from '../../bootstrap/state.js'
import type { Command } from '../../commands.js'

const command: Command = {
  name: 'chrome',
  description: 'Claude in Chrome (Beta) settings',
  availability: ['claude-ai'],
  isEnabled: () => !getIsNonInteractiveSession(),
  type: 'local-jsx',
  load: () => import('./chrome.js'),
}

export default command


