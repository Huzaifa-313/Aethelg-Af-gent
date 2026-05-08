# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: src\commands\buddy\index.ts
# Merge Date: 2026-05-07T19:21:49.376310
# ---

import type { Command } from '../../commands.js'

const buddy = {
  type: 'local-jsx',
  name: 'buddy',
  description: 'Hatch, pet, and manage your Open Claude companion',
  immediate: true,
  argumentHint: '[status|mute|unmute|help]',
  load: () => import('./buddy.js'),
} satisfies Command

export default buddy
