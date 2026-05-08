# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\utils\bash\specs\nohup.ts
# Merge Date: 2026-05-07T19:17:26.683569
# ---

import type { CommandSpec } from '../registry.js'

const nohup: CommandSpec = {
  name: 'nohup',
  description: 'Run a command immune to hangups',
  args: {
    name: 'command',
    description: 'Command to run with nohup',
    isCommand: true,
  },
}

export default nohup

