# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\ink\warn.ts
# Merge Date: 2026-05-07T19:16:58.636457
# ---

import { logForDebugging } from '../utils/debug.js'

export function ifNotInteger(value: number | undefined, name: string): void {
  if (value === undefined) return
  if (Number.isInteger(value)) return
  logForDebugging(`${name} should be an integer, got ${value}`, {
    level: 'warn',
  })
}

