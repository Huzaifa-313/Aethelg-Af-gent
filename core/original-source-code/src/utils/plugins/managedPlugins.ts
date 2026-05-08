# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\utils\plugins\managedPlugins.ts
# Merge Date: 2026-05-07T19:19:50.029686
# ---

import { getSettingsForSource } from '../settings/settings.js'

/**
 * Plugin names locked by org policy (policySettings.enabledPlugins).
 *
 * Returns null when managed settings declare no plugin entries (common
 * case — no policy in effect).
 */
export function getManagedPluginNames(): Set<string> | null {
  const enabledPlugins = getSettingsForSource('policySettings')?.enabledPlugins
  if (!enabledPlugins) {
    return null
  }
  const names = new Set<string>()
  for (const [pluginId, value] of Object.entries(enabledPlugins)) {
    // Only plugin@marketplace boolean entries (true OR false) are
    // protected. Legacy owner/repo array form is not.
    if (typeof value !== 'boolean' || !pluginId.includes('@')) {
      continue
    }
    const name = pluginId.split('@')[0]
    if (name) {
      names.add(name)
    }
  }
  return names.size > 0 ? names : null
}
