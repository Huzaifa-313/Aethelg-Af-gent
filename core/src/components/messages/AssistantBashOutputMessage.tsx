# AETHELGARD MERGED FILE
# Origin Repository: claude-code5
# Original Path: src\components\messages\AssistantBashOutputMessage.tsx
# Merge Date: 2026-05-07T19:17:45.111125
# ---

import * as React from 'react'
import BashToolResultMessage from '../../tools/BashTool/BashToolResultMessage.js'
import { extractTag } from '../../utils/messages.js'

export function AssistantBashOutputMessage({
  content,
  verbose,
}: {
  content: string
  verbose?: boolean
}): React.ReactNode {
  const stdout = extractTag(content, 'bash-stdout') ?? ''
  const stderr = extractTag(content, 'bash-stderr') ?? ''
  const stdoutLines = stdout.split('\n').length
  const stderrLines = stderr.split('\n').length
  return (
    <BashToolResultMessage
      content={{ stdout, stdoutLines, stderr, stderrLines }}
      verbose={!!verbose}
    />
  )
}
