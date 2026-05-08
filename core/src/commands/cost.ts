# AETHELGARD MERGED FILE
# Origin Repository: claude-code5
# Original Path: src\commands\cost.ts
# Merge Date: 2026-05-07T19:17:44.548123
# ---

import type { Command } from '../commands.js'
import { formatTotalCost } from '../cost-tracker.js'

const cost = {
  type: 'local',
  name: 'cost',
  description: 'Show the total cost and duration of the current session',
  isEnabled: true,
  isHidden: false,
  async call() {
    return formatTotalCost()
  },
  userFacingName() {
    return 'cost'
  },
} satisfies Command

export default cost
