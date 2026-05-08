# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\hooks\useFileHistorySnapshotInit.ts
# Merge Date: 2026-05-07T19:14:49.272466
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
