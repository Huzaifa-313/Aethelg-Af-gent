# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: src\commands\cache-probe\index.ts
# Merge Date: 2026-05-07T19:21:49.440309
# ---

import type { Command } from '../../commands.js'
import { isEnvTruthy } from '../../utils/envUtils.js'

const cacheProbe: Command = {
  type: 'local',
  name: 'cache-probe',
  description:
    'Send identical requests to test prompt caching (results in debug log)',
  argumentHint: '[model] [--no-key]',
  isEnabled: () =>
    isEnvTruthy(process.env.CLAUDE_CODE_USE_OPENAI) ||
    isEnvTruthy(process.env.CLAUDE_CODE_USE_GITHUB),
  supportsNonInteractive: false,
  load: () => import('./cache-probe.js'),
}

export default cacheProbe
