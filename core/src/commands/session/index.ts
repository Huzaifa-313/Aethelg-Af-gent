# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\session\index.ts
# Merge Date: 2026-05-07T19:16:38.780452
# ---

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


