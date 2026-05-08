# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { BaseEdge, getBezierPath, type EdgeProps, type Edge } from '@xyflow/react'
import type { BuilderEdgeData } from '@/features/protocols/builder/protocol-builder-store'

export function DefaultEdge(props: EdgeProps<Edge<BuilderEdgeData>>) {
  const { sourceX, sourceY, targetX, targetY, markerEnd, selected } = props
  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY })

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        stroke: selected ? '#3b82f6' : '#64748b',
        strokeWidth: selected ? 3 : 2,
      }}
    />
  )
}
