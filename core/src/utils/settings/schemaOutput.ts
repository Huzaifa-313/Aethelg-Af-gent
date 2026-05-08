# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\utils\settings\schemaOutput.ts
# Merge Date: 2026-05-07T19:17:33.767091
# ---

import { toJSONSchema } from 'zod/v4'
import { jsonStringify } from '../slowOperations.js'
import { SettingsSchema } from './types.js'

export function generateSettingsJSONSchema(): string {
  const jsonSchema = toJSONSchema(SettingsSchema(), { unrepresentable: 'any' })
  return jsonStringify(jsonSchema, null, 2)
}

