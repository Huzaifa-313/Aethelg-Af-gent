# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\hooks\useMailboxBridge.ts
# Merge Date: 2026-05-07T19:16:55.425458
# ---

import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react'
import { useMailbox } from '../context/mailbox.js'

type Props = {
  isLoading: boolean
  onSubmitMessage: (content: string) => boolean
}

export function useMailboxBridge({ isLoading, onSubmitMessage }: Props): void {
  const mailbox = useMailbox()

  const subscribe = useMemo(() => mailbox.subscribe.bind(mailbox), [mailbox])
  const getSnapshot = useCallback(() => mailbox.revision, [mailbox])
  const revision = useSyncExternalStore(subscribe, getSnapshot)

  useEffect(() => {
    if (isLoading) return
    const msg = mailbox.poll()
    if (msg) onSubmitMessage(msg.content)
  }, [isLoading, revision, mailbox, onSubmitMessage])
}

