# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\hooks\useTimeout.ts
# Merge Date: 2026-05-07T19:15:51.025456
# ---

// https://github.com/AnukarOP

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
