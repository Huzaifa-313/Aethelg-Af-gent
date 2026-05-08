# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\utils\memory\versions.ts
# Merge Date: 2026-05-07T19:15:18.210455
# ---

import { findGitRoot } from '../git.js'

// Note: This is used to check git repo status synchronously
// Uses findGitRoot which walks the filesystem (no subprocess)
// Prefer `dirIsInGitRepo()` for async checks
export function projectIsInGitRepo(cwd: string): boolean {
  return findGitRoot(cwd) !== null
}
