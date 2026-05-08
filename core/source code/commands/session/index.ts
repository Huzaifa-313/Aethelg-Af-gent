# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\commands\session\index.ts
# Merge Date: 2026-05-07T19:15:31.686453
# ---

// https://github.com/AnukarOP

import { getIsRemoteMode } from '../../bootstrap/state.js'
import type { Command } from '../../commands.js'

const session = {
  type: 'local-jsx',
  name: 'session',
  aliases: ['remote'],
  description: 'Show remote session URL and QR code',
  isEnabled: () => getIsRemoteMode(),
  get isHidden() {
    return !getIsRemoteMode()
  },
  load: () => import('./session.js'),
} satisfies Command

export default session
