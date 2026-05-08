# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: src\tools\WebSearchTool\providers\duckduckgo.test.ts
# Merge Date: 2026-05-07T19:21:52.694304
# ---

import { describe, expect, test } from 'bun:test'

describe('DuckDuckGo SafeSearchType', () => {
  test('SafeSearchType.STRICT === 0 (matches previous raw value)', async () => {
    const { SafeSearchType } = await import('duck-duck-scrape')
    expect(SafeSearchType.STRICT).toBe(0)
  })

  test('SafeSearchType enum values are sane', async () => {
    const { SafeSearchType } = await import('duck-duck-scrape')
    expect(SafeSearchType.STRICT).toBe(0)
    expect(SafeSearchType.MODERATE).toBe(-1)
    expect(SafeSearchType.OFF).toBe(-2)
  })
})
