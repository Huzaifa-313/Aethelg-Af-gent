# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\stubs\macros.d.ts
# Merge Date: 2026-05-07T19:18:46.013687
# ---

/**
 * Compile-time macros injected by Bun's bundler.
 * These are replaced with string literals during bundling.
 * For our source build, we provide runtime values.
 */

declare const MACRO: {
  VERSION: string
  BUILD_TIME: string
  FEEDBACK_CHANNEL: string
  ISSUES_EXPLAINER: string
  NATIVE_PACKAGE_URL: string
  PACKAGE_URL: string
  VERSION_CHANGELOG: string
}
