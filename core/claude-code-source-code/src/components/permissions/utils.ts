# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\components\permissions\utils.ts
# Merge Date: 2026-05-07T19:18:08.816127
# ---

import { getHostPlatformForAnalytics } from '../../utils/env.js'
import { type CompletionType, logUnaryEvent } from '../../utils/unaryLogging.js'
import type { ToolUseConfirm } from './PermissionRequest.js'

export function logUnaryPermissionEvent(
  completion_type: CompletionType,
  {
    assistantMessage: {
      message: { id: message_id },
    },
  }: ToolUseConfirm,
  event: 'accept' | 'reject',
  hasFeedback?: boolean,
): void {
  void logUnaryEvent({
    completion_type,
    event,
    metadata: {
      language_name: 'none',
      message_id,
      platform: getHostPlatformForAnalytics(),
      hasFeedback: hasFeedback ?? false,
    },
  })
}
