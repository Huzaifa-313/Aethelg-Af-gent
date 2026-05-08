# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\effort\index.ts
# Merge Date: 2026-05-07T19:16:35.783455
# ---

import type { Command } from '../../commands.js'
import { shouldInferenceConfigCommandBeImmediate } from '../../utils/immediateCommand.js'

export default {
  type: 'local-jsx',
  name: 'effort',
  description: 'Set effort level for model usage',
  argumentHint: '[low|medium|high|max|auto]',
  get immediate() {
    return shouldInferenceConfigCommandBeImmediate()
  },
  load: () => import('./effort.js'),
} satisfies Command


