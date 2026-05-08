# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/app/api-client'
import type { AppSettings } from '@/types'

type QueryOptions = {
  enabled?: boolean
}

export const settingsQueryKeys = {
  app: ['settings', 'app'] as const,
}

export function useAppSettingsQuery(options: QueryOptions = {}) {
  return useQuery<AppSettings>({
    queryKey: settingsQueryKeys.app,
    queryFn: () => api<AppSettings>('GET', '/settings'),
    enabled: options.enabled,
    staleTime: 60_000,
  })
}
