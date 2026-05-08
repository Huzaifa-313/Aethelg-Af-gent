# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\ink\layout\engine.ts
# Merge Date: 2026-05-07T19:19:29.950686
# ---

import type { LayoutNode } from './node.js'
import { createYogaLayoutNode } from './yoga.js'

export function createLayoutNode(): LayoutNode {
  return createYogaLayoutNode()
}
