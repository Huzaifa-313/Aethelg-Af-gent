# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\components\agents\utils.ts
# Merge Date: 2026-05-07T19:19:16.251685
# ---

import capitalize from 'lodash-es/capitalize.js'
import type { SettingSource } from 'src/utils/settings/constants.js'
import { getSettingSourceName } from 'src/utils/settings/constants.js'

export function getAgentSourceDisplayName(
  source: SettingSource | 'all' | 'built-in' | 'plugin',
): string {
  if (source === 'all') {
    return 'Agents'
  }
  if (source === 'built-in') {
    return 'Built-in agents'
  }
  if (source === 'plugin') {
    return 'Plugin agents'
  }
  return capitalize(getSettingSourceName(source))
}
