# AETHELGARD MERGED FILE
# Origin Repository: oh-my-claudecode-main
# Original Path: src\__tests__\helpers\prompt-test-helpers.ts
# Merge Date: 2026-05-07T19:21:45.149307
# ---

import { expect } from 'vitest';

export const STANDARD_MISSING_PROMPT_ERROR = "Either 'prompt' (inline) or 'prompt_file' (file path) is required";

export function expectMissingPromptError(text: string): void {
  expect(text).toContain(STANDARD_MISSING_PROMPT_ERROR);
}

export function expectNoMissingPromptError(text: string): void {
  expect(text).not.toContain(STANDARD_MISSING_PROMPT_ERROR);
}
