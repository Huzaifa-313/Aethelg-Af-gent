# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\commands\heapdump\index.ts
# Merge Date: 2026-05-07T19:16:36.101457
# ---

import type { Command } from '../../commands.js'

const heapDump = {
  type: 'local',
  name: 'heapdump',
  description: 'Dump the JS heap to ~/Desktop',
  isHidden: true,
  supportsNonInteractive: true,
  load: () => import('./heapdump.js'),
} satisfies Command

export default heapDump


