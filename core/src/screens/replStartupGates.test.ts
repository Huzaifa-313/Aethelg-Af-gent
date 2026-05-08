# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: src\screens\replStartupGates.test.ts
# Merge Date: 2026-05-07T19:21:50.625306
# ---

import { describe, expect, test } from 'bun:test'

import { shouldRunStartupChecks } from './replStartupGates.js'

describe('shouldRunStartupChecks', () => {
  test('runs checks after first message submission', () => {
    expect(shouldRunStartupChecks({
      isRemoteSession: false,
      hasStarted: false,
      hasHadFirstSubmission: true,
    })).toBe(true)
  })

  test('skips checks in remote sessions even after submission', () => {
    expect(shouldRunStartupChecks({
      isRemoteSession: true,
      hasStarted: false,
      hasHadFirstSubmission: true,
    })).toBe(false)
  })

  test('skips checks if already started', () => {
    expect(shouldRunStartupChecks({
      isRemoteSession: false,
      hasStarted: true,
      hasHadFirstSubmission: true,
    })).toBe(false)
  })

  test('does not run checks before first submission', () => {
    expect(shouldRunStartupChecks({
      isRemoteSession: false,
      hasStarted: false,
      hasHadFirstSubmission: false,
    })).toBe(false)
  })

  test('does not run checks when idle before first submission', () => {
    expect(shouldRunStartupChecks({
      isRemoteSession: false,
      hasStarted: false,
      hasHadFirstSubmission: false,
    })).toBe(false)
  })

  test('skips checks in remote session regardless of other conditions', () => {
    expect(shouldRunStartupChecks({
      isRemoteSession: true,
      hasStarted: false,
      hasHadFirstSubmission: false,
    })).toBe(false)
  })
})