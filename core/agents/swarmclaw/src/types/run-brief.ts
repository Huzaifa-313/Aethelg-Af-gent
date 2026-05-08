# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import type { ExecutionOwnerType, SessionRunStatus } from './run'

export interface RunBriefTimelineItem {
  label: string
  status?: SessionRunStatus
  at: number
  detail?: string | null
}

export interface RunBriefEvidenceItem {
  id: string
  kind: 'citation' | 'retrieval' | 'event'
  title: string
  summary: string
  url?: string | null
  sourceId?: string | null
  createdAt?: number | null
}

export interface RunBrief {
  runId: string
  sessionId: string
  title: string
  objective: string
  status: SessionRunStatus
  source: string
  owner: { type: ExecutionOwnerType; id: string } | null
  timeline: RunBriefTimelineItem[]
  result: string | null
  error: string | null
  warnings: string[]
  usage: {
    inputTokens: number | null
    outputTokens: number | null
    estimatedCost: number | null
    citationCount: number
    sourceIds: string[]
  }
  evidence: RunBriefEvidenceItem[]
  generatedAt: number
}
