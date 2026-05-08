# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\commands\desktop\index.ts
# Merge Date: 2026-05-07T19:15:28.578460
# ---

// https://github.com/AnukarOP

import type { Command } from '../../commands.js'

function isSupportedPlatform(): boolean {
  if (process.platform === 'darwin') {
    return true
  }
  if (process.platform === 'win32' && process.arch === 'x64') {
    return true
  }
  return false
}

const desktop = {
  type: 'local-jsx',
  name: 'desktop',
  aliases: ['app'],
  description: 'Continue the current session in Claude Desktop',
  availability: ['claude-ai'],
  isEnabled: isSupportedPlatform,
  get isHidden() {
    return !isSupportedPlatform()
  },
  load: () => import('./desktop.js'),
} satisfies Command

export default desktop
