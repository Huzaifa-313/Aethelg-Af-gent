# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\hooks\useFileHistorySnapshotInit.ts
# Merge Date: 2026-05-07T19:18:14.703125
# ---

import { useEffect, useRef } from 'react'
import {
  type FileHistorySnapshot,
  type FileHistoryState,
  fileHistoryEnabled,
  fileHistoryRestoreStateFromLog,
} from '../utils/fileHistory.js'

export function useFileHistorySnapshotInit(
  initialFileHistorySnapshots: FileHistorySnapshot[] | undefined,
  fileHistoryState: FileHistoryState,
  onUpdateState: (newState: FileHistoryState) => void,
): void {
  const initialized = useRef(false)

  useEffect(() => {
    if (!fileHistoryEnabled() || initialized.current) {
      return
    }
    initialized.current = true
    if (initialFileHistorySnapshots) {
      fileHistoryRestoreStateFromLog(initialFileHistorySnapshots, onUpdateState)
    }
  }, [fileHistoryState, initialFileHistorySnapshots, onUpdateState])
}
