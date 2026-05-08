# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\components\PromptInput\useShowFastIconHint.ts
# Merge Date: 2026-05-07T19:15:44.772454
# ---

// https://github.com/AnukarOP

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
