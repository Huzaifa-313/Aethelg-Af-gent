# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\commands\keybindings\index.ts
# Merge Date: 2026-05-07T19:19:10.672686
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
