# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\commands\color\index.ts
# Merge Date: 2026-05-07T19:15:28.269454
# ---

// https://github.com/AnukarOP

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
