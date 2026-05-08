# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\utils\permissions\PermissionResult.ts
# Merge Date: 2026-05-07T19:16:23.794455
# ---

// https://github.com/AnukarOP

// Types extracted to src/types/permissions.ts to break import cycles
import type {
  PermissionAllowDecision,
  PermissionAskDecision,
  PermissionDecision,
  PermissionDecisionReason,
  PermissionDenyDecision,
  PermissionMetadata,
  PermissionResult,
} from '../../types/permissions.js'

// Re-export for backwards compatibility
export type {
  PermissionAllowDecision,
  PermissionAskDecision,
  PermissionDecision,
  PermissionDecisionReason,
  PermissionDenyDecision,
  PermissionMetadata,
  PermissionResult,
}

// Helper function to get the appropriate prose description for rule behavior
export function getRuleBehaviorDescription(
  permissionResult: PermissionResult['behavior'],
): string {
  switch (permissionResult) {
    case 'allow':
      return 'allowed'
    case 'deny':
      return 'denied'
    default:
      return 'asked for confirmation for'
  }
}
