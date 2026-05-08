# AETHELGARD MERGED FILE
# Origin Repository: everything-claude-code-main
# Original Path: .opencode\tools\index.ts
# Merge Date: 2026-05-07T19:20:00.737687
# ---

/**
 * ECC Custom Tools for OpenCode
 *
 * These tools extend OpenCode with additional capabilities.
 */

// Re-export all tools
export { default as runTests } from "./run-tests.js"
export { default as checkCoverage } from "./check-coverage.js"
export { default as securityAudit } from "./security-audit.js"
export { default as formatCode } from "./format-code.js"
export { default as lintCheck } from "./lint-check.js"
export { default as gitSummary } from "./git-summary.js"
export { default as changedFiles } from "./changed-files.js"
