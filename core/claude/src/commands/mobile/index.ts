# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\commands\mobile\index.ts
# Merge Date: 2026-05-07T19:14:32.175458
# ---

import type { Command } from '../../commands.js'

const mobile = {
  type: 'local-jsx',
  name: 'mobile',
  aliases: ['ios', 'android'],
  description: 'Show QR code to download the Claude mobile app',
  load: () => import('./mobile.js'),
} satisfies Command

export default mobile
