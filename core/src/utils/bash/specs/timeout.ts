# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\utils\bash\specs\timeout.ts
# Merge Date: 2026-05-07T19:17:26.767577
# ---

import type { CommandSpec } from '../registry.js'

const timeout: CommandSpec = {
  name: 'timeout',
  description: 'Run a command with a time limit',
  args: [
    {
      name: 'duration',
      description: 'Duration to wait before timing out (e.g., 10, 5s, 2m)',
      isOptional: false,
    },
    {
      name: 'command',
      description: 'Command to run',
      isCommand: true,
    },
  ],
}

export default timeout

