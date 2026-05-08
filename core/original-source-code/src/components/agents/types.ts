# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\components\agents\types.ts
# Merge Date: 2026-05-07T19:19:16.245685
# ---

import type { SettingSource } from 'src/utils/settings/constants.js'
import type { AgentDefinition } from '../../tools/AgentTool/loadAgentsDir.js'

export const AGENT_PATHS = {
  FOLDER_NAME: '.claude',
  AGENTS_DIR: 'agents',
} as const

// Base types for common patterns
type WithPreviousMode = { previousMode: ModeState }
type WithAgent = { agent: AgentDefinition }

// Simplified state type using intersection types
export type ModeState =
  | { mode: 'main-menu' }
  | { mode: 'list-agents'; source: SettingSource | 'all' | 'built-in' }
  | ({ mode: 'agent-menu' } & WithAgent & WithPreviousMode)
  | ({ mode: 'view-agent' } & WithAgent & WithPreviousMode)
  | { mode: 'create-agent' }
  | ({ mode: 'edit-agent' } & WithAgent & WithPreviousMode)
  | ({ mode: 'delete-confirm' } & WithAgent & WithPreviousMode)

export type AgentValidationResult = {
  isValid: boolean
  warnings: string[]
  errors: string[]
}
