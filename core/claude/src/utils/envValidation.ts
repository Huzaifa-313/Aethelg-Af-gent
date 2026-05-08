# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\utils\envValidation.ts
# Merge Date: 2026-05-07T19:15:08.616456
# ---

import { logForDebugging } from './debug.js'

export type EnvVarValidationResult = {
  effective: number
  status: 'valid' | 'capped' | 'invalid'
  message?: string
}

export function validateBoundedIntEnvVar(
  name: string,
  value: string | undefined,
  defaultValue: number,
  upperLimit: number,
): EnvVarValidationResult {
  if (!value) {
    return { effective: defaultValue, status: 'valid' }
  }
  const parsed = parseInt(value, 10)
  if (isNaN(parsed) || parsed <= 0) {
    const result: EnvVarValidationResult = {
      effective: defaultValue,
      status: 'invalid',
      message: `Invalid value "${value}" (using default: ${defaultValue})`,
    }
    logForDebugging(`${name} ${result.message}`)
    return result
  }
  if (parsed > upperLimit) {
    const result: EnvVarValidationResult = {
      effective: upperLimit,
      status: 'capped',
      message: `Capped from ${parsed} to ${upperLimit}`,
    }
    logForDebugging(`${name} ${result.message}`)
    return result
  }
  return { effective: parsed, status: 'valid' }
}
