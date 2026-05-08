# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\utils\sandbox\sandbox-ui-utils.ts
# Merge Date: 2026-05-07T19:15:22.100456
# ---

/**
 * UI utilities for sandbox violations
 * These utilities are used for displaying sandbox-related information in the UI
 */

/**
 * Remove <sandbox_violations> tags from text
 * Used to clean up error messages for display purposes
 */
export function removeSandboxViolationTags(text: string): string {
  return text.replace(/<sandbox_violations>[\s\S]*?<\/sandbox_violations>/g, '')
}
