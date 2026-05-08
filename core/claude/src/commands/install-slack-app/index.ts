# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\commands\install-slack-app\index.ts
# Merge Date: 2026-05-07T19:14:31.826456
# ---

import type { Command } from '../../commands.js'

const installSlackApp = {
  type: 'local',
  name: 'install-slack-app',
  description: 'Install the Claude Slack app',
  availability: ['claude-ai'],
  supportsNonInteractive: false,
  load: () => import('./install-slack-app.js'),
} satisfies Command

export default installSlackApp
