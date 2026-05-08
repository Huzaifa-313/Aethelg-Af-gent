# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\utils\shell\outputLimits.ts
# Merge Date: 2026-05-07T19:16:27.484456
# ---

// https://github.com/AnukarOP

import { validateBoundedIntEnvVar } from '../envValidation.js'

export const BASH_MAX_OUTPUT_UPPER_LIMIT = 150_000
export const BASH_MAX_OUTPUT_DEFAULT = 30_000

export function getMaxOutputLength(): number {
  const result = validateBoundedIntEnvVar(
    'BASH_MAX_OUTPUT_LENGTH',
    process.env.BASH_MAX_OUTPUT_LENGTH,
    BASH_MAX_OUTPUT_DEFAULT,
    BASH_MAX_OUTPUT_UPPER_LIMIT,
  )
  return result.effective
}
