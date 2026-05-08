# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

'use client'

import { useSyncExternalStore } from 'react'

function subscribe(cb: () => void) {
  document.addEventListener('visibilitychange', cb)
  return () => document.removeEventListener('visibilitychange', cb)
}

function getSnapshot(): boolean {
  return document.visibilityState === 'visible'
}

function getServerSnapshot(): boolean {
  return true
}

/** Returns `true` when the page is visible, `false` when hidden. SSR-safe. */
export function usePageActive(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
