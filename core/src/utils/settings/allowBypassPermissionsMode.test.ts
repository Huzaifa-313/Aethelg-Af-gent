# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: src\utils\settings\allowBypassPermissionsMode.test.ts
# Merge Date: 2026-05-07T19:21:54.727304
# ---

import { describe, test, expect } from 'bun:test'

describe('SettingsSchema allowBypassPermissionsMode', () => {
  test('accepts allowBypassPermissionsMode: true', async () => {
    const { SettingsSchema } = await import('./types.js')
    const result = SettingsSchema().safeParse({
      permissions: { allowBypassPermissionsMode: true },
    })
    expect(result.success).toBe(true)
  })

  test('accepts allowBypassPermissionsMode: false', async () => {
    const { SettingsSchema } = await import('./types.js')
    const result = SettingsSchema().safeParse({
      permissions: { allowBypassPermissionsMode: false },
    })
    expect(result.success).toBe(true)
  })

  test('rejects non-boolean allowBypassPermissionsMode', async () => {
    const { SettingsSchema } = await import('./types.js')
    const result = SettingsSchema().safeParse({
      permissions: { allowBypassPermissionsMode: 'yes' },
    })
    expect(result.success).toBe(false)
  })
})
