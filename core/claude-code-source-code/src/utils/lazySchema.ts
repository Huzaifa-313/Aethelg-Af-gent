# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\utils\lazySchema.ts
# Merge Date: 2026-05-07T19:18:34.419688
# ---

/**
 * Returns a memoized factory function that constructs the value on first call.
 * Used to defer Zod schema construction from module init time to first access.
 */
export function lazySchema<T>(factory: () => T): () => T {
  let cached: T | undefined
  return () => (cached ??= factory())
}
