# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { useEffect } from 'react'
import { useProtocolBuilderStore } from '../protocol-builder-store'
import { validateDAG } from '../validators/dag-validator'

export function useCanvasValidation() {
  const nodes = useProtocolBuilderStore((s) => s.nodes)
  const edges = useProtocolBuilderStore((s) => s.edges)
  const setValidation = useProtocolBuilderStore((s) => s.setValidation)

  useEffect(() => {
    const { errors, warnings } = validateDAG(nodes, edges)
    setValidation(errors, warnings)
  }, [nodes, edges, setValidation])
}
