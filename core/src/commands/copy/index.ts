# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\copy\index.ts
# Merge Date: 2026-05-07T19:16:35.594456
# ---

/**
 * Copy command - minimal metadata only.
 * Implementation is lazy-loaded from copy.tsx to reduce startup time.
 */
import type { Command } from '../../commands.js'

const copy = {
  type: 'local-jsx',
  name: 'copy',
  description:
    "Copy Claude's last response to clipboard (or /copy N for the Nth-latest)",
  load: () => import('./copy.js'),
} satisfies Command

export default copy


