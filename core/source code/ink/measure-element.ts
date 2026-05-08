# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\ink\measure-element.ts
# Merge Date: 2026-05-07T19:15:52.602455
# ---

// https://github.com/AnukarOP

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
