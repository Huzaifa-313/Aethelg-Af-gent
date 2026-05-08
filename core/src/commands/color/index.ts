# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\color\index.ts
# Merge Date: 2026-05-07T19:16:35.349457
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


