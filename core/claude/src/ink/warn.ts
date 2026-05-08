# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\ink\warn.ts
# Merge Date: 2026-05-07T19:14:52.873455
# ---

import { logForDebugging } from '../utils/debug.js'

export function ifNotInteger(value: number | undefined, name: string): void {
  if (value === undefined) return
  if (Number.isInteger(value)) return
  logForDebugging(`${name} should be an integer, got ${value}`, {
    level: 'warn',
  })
}
