# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\commands\copy\index.ts
# Merge Date: 2026-05-07T19:17:55.477124
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
