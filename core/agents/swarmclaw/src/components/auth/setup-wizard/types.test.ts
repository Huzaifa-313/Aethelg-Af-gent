# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { STEP_ORDER } from './types'

test('STEP_ORDER includes the new onboarding path step', () => {
  assert.deepEqual(STEP_ORDER, ['profile', 'path', 'providers', 'agents'])
})

test('STEP_ORDER has exactly 4 steps', () => {
  assert.equal(STEP_ORDER.length, 4)
})
