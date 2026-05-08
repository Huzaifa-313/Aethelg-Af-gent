# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\utils\bash\specs\sleep.ts
# Merge Date: 2026-05-07T19:19:47.165686
# ---

import type { CommandSpec } from '../registry.js'

const sleep: CommandSpec = {
  name: 'sleep',
  description: 'Delay for a specified amount of time',
  args: {
    name: 'duration',
    description: 'Duration to sleep (seconds or with suffix like 5s, 2m, 1h)',
    isOptional: false,
  },
}

export default sleep
