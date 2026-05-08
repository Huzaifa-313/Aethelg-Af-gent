# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\utils\sandbox\sandbox-ui-utils.ts
# Merge Date: 2026-05-07T19:16:26.621458
# ---

// https://github.com/AnukarOP

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
