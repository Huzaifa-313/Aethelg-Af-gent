# AETHELGARD MERGED FILE
# Origin Repository: claude-code5
# Original Path: src\commands\config.tsx
# Merge Date: 2026-05-07T19:17:44.535123
# ---

import { Command } from '../commands.js'
import { Config } from '../components/Config.js'
import * as React from 'react'

const config = {
  type: 'local-jsx',
  name: 'config',
  description: 'Open config panel',
  isEnabled: true,
  isHidden: false,
  async call(onDone) {
    return <Config onClose={onDone} />
  },
  userFacingName() {
    return 'config'
  },
} satisfies Command

export default config
