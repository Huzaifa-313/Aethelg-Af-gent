# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\utils\objectGroupBy.ts
# Merge Date: 2026-05-07T19:17:22.313567
# ---

/**
 * https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.groupby
 */
export function objectGroupBy<T, K extends PropertyKey>(
  items: Iterable<T>,
  keySelector: (item: T, index: number) => K,
): Partial<Record<K, T[]>> {
  const result = Object.create(null) as Partial<Record<K, T[]>>
  let index = 0
  for (const item of items) {
    const key = keySelector(item, index++)
    if (result[key] === undefined) {
      result[key] = []
    }
    result[key].push(item)
  }
  return result
}

