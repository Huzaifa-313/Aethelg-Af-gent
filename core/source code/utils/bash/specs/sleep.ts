# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\utils\bash\specs\sleep.ts
# Merge Date: 2026-05-07T19:16:20.273458
# ---

// https://github.com/AnukarOP

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
