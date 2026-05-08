# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\utils\bash\specs\srun.ts
# Merge Date: 2026-05-07T19:16:20.294456
# ---

// https://github.com/AnukarOP

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
