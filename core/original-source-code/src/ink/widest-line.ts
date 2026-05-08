# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\ink\widest-line.ts
# Merge Date: 2026-05-07T19:19:29.427687
# ---

import { lineWidth } from './line-width-cache.js'

export function widestLine(string: string): number {
  let maxWidth = 0
  let start = 0

  while (start <= string.length) {
    const end = string.indexOf('\n', start)
    const line =
      end === -1 ? string.substring(start) : string.substring(start, end)

    maxWidth = Math.max(maxWidth, lineWidth(line))

    if (end === -1) break
    start = end + 1
  }

  return maxWidth
}
