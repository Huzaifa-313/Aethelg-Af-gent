# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\branch\index.ts
# Merge Date: 2026-05-07T19:16:35.042456
# ---

import { feature } from 'bun:bundle'
import type { Command } from '../../commands.js'

const branch = {
  type: 'local-jsx',
  name: 'branch',
  // 'fork' alias only when /fork doesn't exist as its own command
  aliases: feature('FORK_SUBAGENT') ? [] : ['fork'],
  description: 'Create a branch of the current conversation at this point',
  argumentHint: '[name]',
  load: () => import('./branch.js'),
} satisfies Command

export default branch


