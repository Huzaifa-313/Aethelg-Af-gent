# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\ink\layout\engine.ts
# Merge Date: 2026-05-07T19:16:59.731457
# ---

import type { LayoutNode } from './node.js'
import { createYogaLayoutNode } from './yoga.js'

export function createLayoutNode(): LayoutNode {
  return createYogaLayoutNode()
}

