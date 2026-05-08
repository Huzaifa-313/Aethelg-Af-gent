# AETHELGARD MERGED FILE
# Origin Repository: claude-code5
# Original Path: src\commands\help.tsx
# Merge Date: 2026-05-07T19:17:44.602122
# ---

import { Command } from '../commands.js'
import { Help } from '../components/Help.js'
import * as React from 'react'

const help = {
  type: 'local-jsx',
  name: 'help',
  description: 'Show help and available commands',
  isEnabled: true,
  isHidden: false,
  async call(onDone, { options: { commands } }) {
    return <Help commands={commands} onClose={onDone} />
  },
  userFacingName() {
    return 'help'
  },
} satisfies Command

export default help
