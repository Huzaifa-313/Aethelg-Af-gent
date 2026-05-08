# AETHELGARD MERGED FILE
# Origin Repository: claude-code5
# Original Path: src\commands\bug.tsx
# Merge Date: 2026-05-07T19:17:44.491123
# ---

import { Command } from '../commands.js'
import { Bug } from '../components/Bug.js'
import * as React from 'react'
import { PRODUCT_NAME } from '../constants/product.js'

const bug = {
  type: 'local-jsx',
  name: 'bug',
  description: `Submit feedback about ${PRODUCT_NAME}`,
  isEnabled: true,
  isHidden: false,
  async call(onDone) {
    return <Bug onDone={onDone} />
  },
  userFacingName() {
    return 'bug'
  },
} satisfies Command

export default bug
