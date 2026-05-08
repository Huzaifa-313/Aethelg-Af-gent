# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\stubs\global.d.ts
# Merge Date: 2026-05-07T19:18:45.997687
# ---

// Global type for MACRO compile-time constants
// These are normally injected by Bun's bundler via --define at compile time
declare const MACRO: {
  VERSION: string
  BUILD_TIME: string
  FEEDBACK_CHANNEL: string
  ISSUES_EXPLAINER: string
  NATIVE_PACKAGE_URL: string
  PACKAGE_URL: string
  VERSION_CHANGELOG: string
}
