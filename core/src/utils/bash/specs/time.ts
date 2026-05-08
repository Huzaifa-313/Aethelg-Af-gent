# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\utils\bash\specs\time.ts
# Merge Date: 2026-05-07T19:17:26.752572
# ---

import type { CommandSpec } from '../registry.js'

const time: CommandSpec = {
  name: 'time',
  description: 'Time a command',
  args: {
    name: 'command',
    description: 'Command to time',
    isCommand: true,
  },
}

export default time

