# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\constants\errorIds.ts
# Merge Date: 2026-05-07T19:16:52.957456
# ---

/**
 * Error IDs for tracking error sources in production.
 * These IDs are obfuscated identifiers that help us trace
 * which logError() call generated an error.
 *
 * These errors are represented as individual const exports for optimal
 * dead code elimination (external build will only see the numbers).
 *
 * ADDING A NEW ERROR TYPE:
 * 1. Add a const based on Next ID.
 * 2. Increment Next ID.
 * Next ID: 346
 */

export const E_TOOL_USE_SUMMARY_GENERATION_FAILED = 344

