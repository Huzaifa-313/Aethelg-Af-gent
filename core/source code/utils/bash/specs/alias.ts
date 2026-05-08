# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\utils\bash\specs\alias.ts
# Merge Date: 2026-05-07T19:16:20.181453
# ---

// https://github.com/AnukarOP

import type { CommandSpec } from '../registry.js'

const alias: CommandSpec = {
  name: 'alias',
  description: 'Create or list command aliases',
  args: {
    name: 'definition',
    description: 'Alias definition in the form name=value',
    isOptional: true,
    isVariadic: true,
  },
}

export default alias
