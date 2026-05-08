# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\ink\warn.ts
# Merge Date: 2026-05-07T19:19:29.423688
# ---

import { logForDebugging } from '../utils/debug.js'

export function ifNotInteger(value: number | undefined, name: string): void {
  if (value === undefined) return
  if (Number.isInteger(value)) return
  logForDebugging(`${name} should be an integer, got ${value}`, {
    level: 'warn',
  })
}
