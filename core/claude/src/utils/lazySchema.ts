# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\utils\lazySchema.ts
# Merge Date: 2026-05-07T19:15:10.457455
# ---

/**
 * Returns a memoized factory function that constructs the value on first call.
 * Used to defer Zod schema construction from module init time to first access.
 */
export function lazySchema<T>(factory: () => T): () => T {
  let cached: T | undefined
  return () => (cached ??= factory())
}
