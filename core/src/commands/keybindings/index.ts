# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\keybindings\index.ts
# Merge Date: 2026-05-07T19:16:36.756456
# ---

import type { Command } from '../../commands.js'
import { isKeybindingCustomizationEnabled } from '../../keybindings/loadUserBindings.js'

const keybindings = {
  name: 'keybindings',
  description: 'Open or create your keybindings configuration file',
  isEnabled: () => isKeybindingCustomizationEnabled(),
  supportsNonInteractive: false,
  type: 'local',
  load: () => import('./keybindings.js'),
} satisfies Command

export default keybindings


