# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\migrations\migrateBypassPermissionsAcceptedToSettings.ts
# Merge Date: 2026-05-07T19:19:30.753702
# ---

import { logEvent } from 'src/services/analytics/index.js'
import { getGlobalConfig, saveGlobalConfig } from '../utils/config.js'
import { logError } from '../utils/log.js'
import {
  hasSkipDangerousModePermissionPrompt,
  updateSettingsForSource,
} from '../utils/settings/settings.js'

/**
 * Migration: Move bypassPermissionsModeAccepted from global config to settings.json
 * as skipDangerousModePermissionPrompt. This is a better home since settings.json
 * is the user-configurable settings file.
 */
export function migrateBypassPermissionsAcceptedToSettings(): void {
  const globalConfig = getGlobalConfig()

  if (!globalConfig.bypassPermissionsModeAccepted) {
    return
  }

  try {
    if (!hasSkipDangerousModePermissionPrompt()) {
      updateSettingsForSource('userSettings', {
        skipDangerousModePermissionPrompt: true,
      })
    }

    logEvent('tengu_migrate_bypass_permissions_accepted', {})

    saveGlobalConfig(current => {
      if (!('bypassPermissionsModeAccepted' in current)) return current
      const { bypassPermissionsModeAccepted: _, ...updatedConfig } = current
      return updatedConfig
    })
  } catch (error) {
    logError(
      new Error(`Failed to migrate bypass permissions accepted: ${error}`),
    )
  }
}
