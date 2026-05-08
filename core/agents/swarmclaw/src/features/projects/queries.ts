# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { useQuery } from '@tanstack/react-query'
import { fetchProjects } from '@/lib/projects'
import type { Project } from '@/types'

type QueryOptions = {
  enabled?: boolean
}

export const projectQueryKeys = {
  all: ['projects'] as const,
}

export function useProjectsQuery(options: QueryOptions = {}) {
  return useQuery<Record<string, Project>>({
    queryKey: projectQueryKeys.all,
    queryFn: fetchProjects,
    enabled: options.enabled,
    staleTime: 60_000,
  })
}
