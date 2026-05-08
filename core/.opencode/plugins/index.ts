# AETHELGARD MERGED FILE
# Origin Repository: everything-claude-code-main
# Original Path: .opencode\plugins\index.ts
# Merge Date: 2026-05-07T19:20:00.181687
# ---

/**
 * Everything Claude Code (ECC) Plugins for OpenCode
 *
 * This module exports all ECC plugins for OpenCode integration.
 * Plugins provide hook-based automation that mirrors Claude Code's hook system
 * while taking advantage of OpenCode's more sophisticated 20+ event types.
 */

export { ECCHooksPlugin, default } from "./ecc-hooks.js"

// Re-export for named imports
export * from "./ecc-hooks.js"
