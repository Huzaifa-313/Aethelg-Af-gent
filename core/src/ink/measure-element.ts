# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\ink\measure-element.ts
# Merge Date: 2026-05-07T19:16:57.801457
# ---

import type { DOMElement } from './dom.js'

type Output = {
  /**
   * Element width.
   */
  width: number

  /**
   * Element height.
   */
  height: number
}

/**
 * Measure the dimensions of a particular `<Box>` element.
 */
const measureElement = (node: DOMElement): Output => ({
  width: node.yogaNode?.getComputedWidth() ?? 0,
  height: node.yogaNode?.getComputedHeight() ?? 0,
})

export default measureElement

