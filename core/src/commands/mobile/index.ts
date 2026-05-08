# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\mobile\index.ts
# Merge Date: 2026-05-07T19:16:37.070457
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


