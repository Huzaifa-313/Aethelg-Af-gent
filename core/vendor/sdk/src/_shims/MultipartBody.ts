# AETHELGARD MERGED FILE
# Origin Repository: claude-code5
# Original Path: vendor\sdk\src\_shims\MultipartBody.ts
# Merge Date: 2026-05-07T19:17:50.562124
# ---

/**
 * Disclaimer: modules in _shims aren't intended to be imported by SDK users.
 */
export class MultipartBody {
  constructor(public body: any) {}
  get [Symbol.toStringTag](): string {
    return 'MultipartBody';
  }
}
