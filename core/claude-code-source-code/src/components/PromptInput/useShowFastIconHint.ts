# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\components\PromptInput\useShowFastIconHint.ts
# Merge Date: 2026-05-07T19:18:11.021129
# ---

import { useEffect, useState } from 'react'

const HINT_DISPLAY_DURATION_MS = 5000

let hasShownThisSession = false

/**
 * Hook to manage the /fast hint display next to the fast icon.
 * Shows the hint for 5 seconds once per session.
 */
export function useShowFastIconHint(showFastIcon: boolean): boolean {
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    if (hasShownThisSession || !showFastIcon) {
      return
    }

    hasShownThisSession = true
    setShowHint(true)

    const timer = setTimeout(setShowHint, HINT_DISPLAY_DURATION_MS, false)

    return () => {
      clearTimeout(timer)
      setShowHint(false)
    }
  }, [showFastIcon])

  return showHint
}
