# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\commands\install-slack-app\index.ts
# Merge Date: 2026-05-07T19:15:29.638457
# ---

// https://github.com/AnukarOP

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
