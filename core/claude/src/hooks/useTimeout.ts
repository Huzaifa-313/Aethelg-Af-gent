# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\hooks\useTimeout.ts
# Merge Date: 2026-05-07T19:14:50.725457
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
