# AETHELGARD MERGED FILE
# Origin Repository: claude-code5
# Original Path: src\hooks\useLogStartupTime.ts
# Merge Date: 2026-05-07T19:17:45.338125
# ---

import { useEffect } from 'react'
import { logEvent } from '../services/statsig.js'

export function useLogStartupTime(): void {
  useEffect(() => {
    const startupTimeMs = Math.round(process.uptime() * 1000)
    logEvent('tengu_timer', {
      event: 'startup',
      durationMs: String(startupTimeMs),
    })
  }, [])
}
