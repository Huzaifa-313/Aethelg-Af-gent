# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\ink\layout\engine.ts
# Merge Date: 2026-05-07T19:15:54.804455
# ---

// https://github.com/AnukarOP

import type { LayoutNode } from './node.js'
import { createYogaLayoutNode } from './yoga.js'

export function createLayoutNode(): LayoutNode {
  return createYogaLayoutNode()
}
