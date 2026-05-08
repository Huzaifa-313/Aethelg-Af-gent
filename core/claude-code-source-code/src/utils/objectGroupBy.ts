# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\utils\objectGroupBy.ts
# Merge Date: 2026-05-07T19:18:35.107686
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
