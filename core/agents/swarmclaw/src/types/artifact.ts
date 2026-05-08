# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

export type EvidenceArtifactKind =
  | 'task_artifact'
  | 'task_output'
  | 'completion_report'
  | 'task_result'
  | 'protocol_artifact'
  | 'mission_report'
  | 'share_link'
  | 'mission_milestone'
  | 'run_result'
  | 'run_error'
  | 'run_citation'

export interface EvidenceArtifact {
  id: string
  kind: EvidenceArtifactKind
  title: string
  description?: string | null
  url?: string | null
  href?: string | null
  preview?: string | null
  createdAt?: number | null
  source: {
    type: 'run' | 'mission' | 'task' | 'protocol' | 'share'
    id: string
    label?: string | null
  }
}
