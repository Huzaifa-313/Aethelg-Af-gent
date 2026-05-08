# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\commands\color\index.ts
# Merge Date: 2026-05-07T19:19:09.627686
# ---

/**
 * Color command - minimal metadata only.
 * Implementation is lazy-loaded from color.ts to reduce startup time.
 */
import type { Command } from '../../commands.js'

const color = {
  type: 'local-jsx',
  name: 'color',
  description: 'Set the prompt bar color for this session',
  immediate: true,
  argumentHint: '<color|default>',
  load: () => import('./color.js'),
} satisfies Command

export default color
