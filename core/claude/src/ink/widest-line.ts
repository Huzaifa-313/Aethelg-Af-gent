# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\ink\widest-line.ts
# Merge Date: 2026-05-07T19:14:52.890454
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
