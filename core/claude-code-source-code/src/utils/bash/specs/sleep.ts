# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\utils\bash\specs\sleep.ts
# Merge Date: 2026-05-07T19:18:38.917688
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
