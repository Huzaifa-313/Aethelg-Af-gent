# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\utils\settings\schemaOutput.ts
# Merge Date: 2026-05-07T19:15:22.479456
# ---

import { toJSONSchema } from 'zod/v4'
import { jsonStringify } from '../slowOperations.js'
import { SettingsSchema } from './types.js'

export function generateSettingsJSONSchema(): string {
  const jsonSchema = toJSONSchema(SettingsSchema(), { unrepresentable: 'any' })
  return jsonStringify(jsonSchema, null, 2)
}
