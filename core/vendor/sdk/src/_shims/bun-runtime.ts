# AETHELGARD MERGED FILE
# Origin Repository: claude-code5
# Original Path: vendor\sdk\src\_shims\bun-runtime.ts
# Merge Date: 2026-05-07T19:17:50.474123
# ---

/**
 * Disclaimer: modules in _shims aren't intended to be imported by SDK users.
 */
import { type Shims } from "./registry.js";
import { getRuntime as getWebRuntime } from "./web-runtime.js";
import { ReadStream as FsReadStream } from 'node:fs';

export function getRuntime(): Shims {
  const runtime = getWebRuntime();
  function isFsReadStream(value: any): value is FsReadStream {
    return value instanceof FsReadStream;
  }
  return { ...runtime, isFsReadStream };
}
