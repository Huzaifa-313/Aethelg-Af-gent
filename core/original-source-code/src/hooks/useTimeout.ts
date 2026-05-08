# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\hooks\useTimeout.ts
# Merge Date: 2026-05-07T19:19:27.571688
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
