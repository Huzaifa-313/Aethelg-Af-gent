# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\utils\set.ts
# Merge Date: 2026-05-07T19:19:44.899686
# ---

/**
 * Note: this code is hot, so is optimized for speed.
 */
export function difference<A>(a: Set<A>, b: Set<A>): Set<A> {
  const result = new Set<A>()
  for (const item of a) {
    if (!b.has(item)) {
      result.add(item)
    }
  }
  return result
}

/**
 * Note: this code is hot, so is optimized for speed.
 */
export function intersects<A>(a: Set<A>, b: Set<A>): boolean {
  if (a.size === 0 || b.size === 0) {
    return false
  }
  for (const item of a) {
    if (b.has(item)) {
      return true
    }
  }
  return false
}

/**
 * Note: this code is hot, so is optimized for speed.
 */
export function every<A>(a: ReadonlySet<A>, b: ReadonlySet<A>): boolean {
  for (const item of a) {
    if (!b.has(item)) {
      return false
    }
  }
  return true
}

/**
 * Note: this code is hot, so is optimized for speed.
 */
export function union<A>(a: Set<A>, b: Set<A>): Set<A> {
  const result = new Set<A>()
  for (const item of a) {
    result.add(item)
  }
  for (const item of b) {
    result.add(item)
  }
  return result
}
