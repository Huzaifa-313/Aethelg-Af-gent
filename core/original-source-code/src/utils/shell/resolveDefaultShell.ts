# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\utils\shell\resolveDefaultShell.ts
# Merge Date: 2026-05-07T19:19:52.195689
# ---

import { getInitialSettings } from '../settings/settings.js'

/**
 * Resolve the default shell for input-box `!` commands.
 *
 * Resolution order (docs/design/ps-shell-selection.md §4.2):
 *   settings.defaultShell → 'bash'
 *
 * Platform default is 'bash' everywhere — we do NOT auto-flip Windows to
 * PowerShell (would break existing Windows users with bash hooks).
 */
export function resolveDefaultShell(): 'bash' | 'powershell' {
  return getInitialSettings().defaultShell ?? 'bash'
}
