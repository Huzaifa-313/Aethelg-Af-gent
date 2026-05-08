# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: src\services\tools\toolExecution.test.ts
# Merge Date: 2026-05-07T19:21:52.105305
# ---

import { describe, expect, test } from 'bun:test'

import { SkillTool } from '../../tools/SkillTool/SkillTool.js'
import {
  getSchemaValidationErrorOverride,
  getSchemaValidationToolUseResult,
} from './toolExecution.js'

describe('getSchemaValidationErrorOverride', () => {
  test('returns actionable missing-skill error for SkillTool', () => {
    expect(getSchemaValidationErrorOverride(SkillTool, {})).toBe(
      'Missing skill name. Pass the slash command name as the skill parameter (e.g., skill: "commit" for /commit, skill: "review-pr" for /review-pr).',
    )
  })

  test('does not override unrelated tool schema failures', () => {
    expect(getSchemaValidationErrorOverride({ name: 'Read' } as never, {})).toBe(
      null,
    )
  })

  test('does not override SkillTool when skill is present', () => {
    expect(
      getSchemaValidationErrorOverride(SkillTool, { skill: 'commit' }),
    ).toBe(null)
  })

  test('uses the actionable override for structured toolUseResult too', () => {
    expect(getSchemaValidationToolUseResult(SkillTool, {} as never)).toBe(
      'InputValidationError: Missing skill name. Pass the slash command name as the skill parameter (e.g., skill: "commit" for /commit, skill: "review-pr" for /review-pr).',
    )
  })
})
