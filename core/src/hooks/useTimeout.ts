# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\hooks\useTimeout.ts
# Merge Date: 2026-05-07T19:16:56.389455
# ---

import { useEffect, useState } from 'react'

export function useTimeout(delay: number, resetTrigger?: number): boolean {
  const [isElapsed, setIsElapsed] = useState(false)

  useEffect(() => {
    setIsElapsed(false)
    const timer = setTimeout(setIsElapsed, delay, true)

    return () => clearTimeout(timer)
  }, [delay, resetTrigger])

  return isElapsed
}

