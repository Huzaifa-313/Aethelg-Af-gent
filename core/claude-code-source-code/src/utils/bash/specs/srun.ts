# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\utils\bash\specs\srun.ts
# Merge Date: 2026-05-07T19:18:38.934687
# ---

import type { CommandSpec } from '../registry.js'

const srun: CommandSpec = {
  name: 'srun',
  description: 'Run a command on SLURM cluster nodes',
  options: [
    {
      name: ['-n', '--ntasks'],
      description: 'Number of tasks',
      args: {
        name: 'count',
        description: 'Number of tasks to run',
      },
    },
    {
      name: ['-N', '--nodes'],
      description: 'Number of nodes',
      args: {
        name: 'count',
        description: 'Number of nodes to allocate',
      },
    },
  ],
  args: {
    name: 'command',
    description: 'Command to run on the cluster',
    isCommand: true,
  },
}

export default srun
