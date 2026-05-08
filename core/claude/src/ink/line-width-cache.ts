# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\ink\line-width-cache.ts
# Merge Date: 2026-05-07T19:14:52.049455
# ---

import { stringWidth } from './stringWidth.js'

// During streaming, text grows but completed lines are immutable.
// Caching stringWidth per-line avoids re-measuring hundreds of
// unchanged lines on every token (~50x reduction in stringWidth calls).
const cache = new Map<string, number>()

const MAX_CACHE_SIZE = 4096

export function lineWidth(line: string): number {
  const cached = cache.get(line)
  if (cached !== undefined) return cached

  const width = stringWidth(line)

  // Evict when cache grows too large (e.g. after many different responses).
  // Simple full-clear is fine — the cache repopulates in one frame.
  if (cache.size >= MAX_CACHE_SIZE) {
    cache.clear()
  }

  cache.set(line, width)
  return width
}
