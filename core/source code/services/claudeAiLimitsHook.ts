# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\services\claudeAiLimitsHook.ts
# Merge Date: 2026-05-07T19:15:57.461458
# ---

// https://github.com/AnukarOP

import { useEffect, useState } from 'react'
import {
  type ClaudeAILimits,
  currentLimits,
  statusListeners,
} from './claudeAiLimits.js'

export function useClaudeAiLimits(): ClaudeAILimits {
  const [limits, setLimits] = useState<ClaudeAILimits>({ ...currentLimits })

  useEffect(() => {
    const listener = (newLimits: ClaudeAILimits) => {
      setLimits({ ...newLimits })
    }
    statusListeners.add(listener)

    return () => {
      statusListeners.delete(listener)
    }
  }, [])

  return limits
}
