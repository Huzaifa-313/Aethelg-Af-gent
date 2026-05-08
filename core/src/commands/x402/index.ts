# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\x402\index.ts
# Merge Date: 2026-05-07T19:16:39.400458
# ---

import type { Command } from '../../commands.js'

const x402 = {
  type: 'local',
  name: 'x402',
  aliases: ['wallet', 'pay'],
  description: 'Configure x402 crypto payments (USDC on Base)',
  argumentHint: '[setup|status|enable|disable|set-limit|remove]',
  supportsNonInteractive: true,
  load: () => import('./x402.js'),
} satisfies Command

export default x402
