# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/app/api-client'
import type { ExternalAgentRuntime } from '@/types'

type QueryOptions = {
  enabled?: boolean
}

export const externalAgentQueryKeys = {
  all: ['external-agents'] as const,
}

export function useExternalAgentsQuery(options: QueryOptions = {}) {
  return useQuery<ExternalAgentRuntime[]>({
    queryKey: externalAgentQueryKeys.all,
    queryFn: () => api<ExternalAgentRuntime[]>('GET', '/external-agents'),
    enabled: options.enabled,
    staleTime: 20_000,
  })
}

export function useExternalAgentRuntimeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      runtimeId,
      action,
    }: {
      runtimeId: string
      action: 'activate' | 'drain' | 'cordon' | 'restart'
    }) => api('PUT', `/external-agents/${runtimeId}`, { action }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: externalAgentQueryKeys.all })
    },
  })
}
