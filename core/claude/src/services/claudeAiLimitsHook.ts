# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\services\claudeAiLimitsHook.ts
# Merge Date: 2026-05-07T19:14:55.836456
# ---

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
