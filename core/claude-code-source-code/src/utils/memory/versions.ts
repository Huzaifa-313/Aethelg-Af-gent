# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\utils\memory\versions.ts
# Merge Date: 2026-05-07T19:18:40.418685
# ---

import { findGitRoot } from '../git.js'

// Note: This is used to check git repo status synchronously
// Uses findGitRoot which walks the filesystem (no subprocess)
// Prefer `dirIsInGitRepo()` for async checks
export function projectIsInGitRepo(cwd: string): boolean {
  return findGitRoot(cwd) !== null
}
