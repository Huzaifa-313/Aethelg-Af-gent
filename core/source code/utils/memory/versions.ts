# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\utils\memory\versions.ts
# Merge Date: 2026-05-07T19:16:22.448457
# ---

// https://github.com/AnukarOP

import { findGitRoot } from '../git.js'

// Note: This is used to check git repo status synchronously
// Uses findGitRoot which walks the filesystem (no subprocess)
// Prefer `dirIsInGitRepo()` for async checks
export function projectIsInGitRepo(cwd: string): boolean {
  return findGitRoot(cwd) !== null
}
