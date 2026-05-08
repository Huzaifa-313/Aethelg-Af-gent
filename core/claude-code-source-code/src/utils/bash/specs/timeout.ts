# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\utils\bash\specs\timeout.ts
# Merge Date: 2026-05-07T19:18:38.954688
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
