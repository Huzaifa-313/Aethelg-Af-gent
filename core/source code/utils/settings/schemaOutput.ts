# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\utils\settings\schemaOutput.ts
# Merge Date: 2026-05-07T19:16:27.040460
# ---

// https://github.com/AnukarOP

import { toJSONSchema } from 'zod/v4'
import { jsonStringify } from '../slowOperations.js'
import { SettingsSchema } from './types.js'

export function generateSettingsJSONSchema(): string {
  const jsonSchema = toJSONSchema(SettingsSchema(), { unrepresentable: 'any' })
  return jsonStringify(jsonSchema, null, 2)
}
