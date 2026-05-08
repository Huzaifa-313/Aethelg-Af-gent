# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\hooks\useTerminalSize.ts
# Merge Date: 2026-05-07T19:16:56.328457
# ---

import { useContext } from 'react'
import {
  type TerminalSize,
  TerminalSizeContext,
} from 'src/ink/components/TerminalSizeContext.js'

export function useTerminalSize(): TerminalSize {
  const size = useContext(TerminalSizeContext)

  if (!size) {
    throw new Error('useTerminalSize must be used within an Ink App component')
  }

  return size
}

