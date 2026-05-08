# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\utils\withResolvers.ts
# Merge Date: 2026-05-07T19:17:25.464568
# ---

/**
 * Polyfill for Promise.withResolvers() (ES2024, Node 22+).
 * package.json declares "engines": { "node": ">=18.0.0" } so we can't use the native one.
 */
export function withResolvers<T>(): PromiseWithResolvers<T> {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

