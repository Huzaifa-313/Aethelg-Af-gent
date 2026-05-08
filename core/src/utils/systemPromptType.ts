# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\utils\systemPromptType.ts
# Merge Date: 2026-05-07T19:17:24.319569
# ---

/**
 * Branded type for system prompt arrays.
 *
 * This module is intentionally dependency-free so it can be imported
 * from anywhere without risking circular initialization issues.
 */

export type SystemPrompt = readonly string[] & {
  readonly __brand: 'SystemPrompt'
}

export function asSystemPrompt(value: readonly string[]): SystemPrompt {
  return value as SystemPrompt
}

