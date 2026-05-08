# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\privacy-settings\index.ts
# Merge Date: 2026-05-07T19:16:38.097455
# ---

import type { Command } from '../../commands.js'
import { isConsumerSubscriber } from '../../utils/auth.js'

const privacySettings = {
  type: 'local-jsx',
  name: 'privacy-settings',
  description: 'View and update your privacy settings',
  isEnabled: () => {
    return isConsumerSubscriber()
  },
  load: () => import('./privacy-settings.js'),
} satisfies Command

export default privacySettings


