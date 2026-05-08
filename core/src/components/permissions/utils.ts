# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\components\permissions\utils.ts
# Merge Date: 2026-05-07T19:16:48.806456
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

