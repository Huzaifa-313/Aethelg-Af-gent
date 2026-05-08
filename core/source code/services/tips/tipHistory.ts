# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\services\tips\tipHistory.ts
# Merge Date: 2026-05-07T19:16:01.847457
# ---

// https://github.com/AnukarOP

import { getGlobalConfig, saveGlobalConfig } from '../../utils/config.js'

export function recordTipShown(tipId: string): void {
  const numStartups = getGlobalConfig().numStartups
  saveGlobalConfig(c => {
    const history = c.tipsHistory ?? {}
    if (history[tipId] === numStartups) return c
    return { ...c, tipsHistory: { ...history, [tipId]: numStartups } }
  })
}

export function getSessionsSinceLastShown(tipId: string): number {
  const config = getGlobalConfig()
  const lastShown = config.tipsHistory?.[tipId]
  if (!lastShown) return Infinity
  return config.numStartups - lastShown
}
