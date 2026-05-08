# AETHELGARD MERGED FILE
# Origin Repository: claude-code5
# Original Path: src\components\Cost.tsx
# Merge Date: 2026-05-07T19:17:44.861124
# ---

import * as React from 'react'
import { Box, Text } from 'ink'

type Props = {
  costUSD: number
  durationMs: number
  debug: boolean
}

export function Cost({ costUSD, durationMs, debug }: Props): React.ReactNode {
  if (!debug) {
    return null
  }

  const durationInSeconds = (durationMs / 1000).toFixed(1)
  return (
    <Box flexDirection="column" minWidth={23} width={23}>
      <Text dimColor>
        Cost: ${costUSD.toFixed(4)} ({durationInSeconds}s)
      </Text>
    </Box>
  )
}
