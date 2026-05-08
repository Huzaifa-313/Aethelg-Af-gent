# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\utils\bash\specs\time.ts
# Merge Date: 2026-05-07T19:19:47.176689
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
