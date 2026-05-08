# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\utils\userAgent.ts
# Merge Date: 2026-05-07T19:17:25.318572
# ---

/**
 * User-Agent string helpers.
 *
 * Kept dependency-free so SDK-bundled code (bridge, cli/transports) can
 * import without pulling in auth.ts and its transitive dependency tree.
 */

export function getClaudeCodeUserAgent(): string {
  return `claude-code/${MACRO.VERSION}`
}

