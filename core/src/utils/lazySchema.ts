# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\utils\lazySchema.ts
# Merge Date: 2026-05-07T19:17:21.551567
# ---

/**
 * Returns a memoized factory function that constructs the value on first call.
 * Used to defer Zod schema construction from module init time to first access.
 */
export function lazySchema<T>(factory: () => T): () => T {
  let cached: T | undefined
  return () => (cached ??= factory())
}

