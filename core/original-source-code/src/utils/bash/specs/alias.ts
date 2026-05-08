# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\utils\bash\specs\alias.ts
# Merge Date: 2026-05-07T19:19:47.130687
# ---

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
