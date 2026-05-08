# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: src\commands\onboard-github\index.ts
# Merge Date: 2026-05-07T19:21:49.586307
# ---

import type { Command } from '../../commands.js'

const onboardGithub: Command = {
  name: 'onboard-github',
  aliases: ['onboarding-github', 'onboardgithub', 'onboardinggithub'],
  description:
    'Interactive setup for GitHub Copilot: OAuth device login stored in secure storage',
  type: 'local-jsx',
  load: () => import('./onboard-github.js'),
}

export default onboardGithub
