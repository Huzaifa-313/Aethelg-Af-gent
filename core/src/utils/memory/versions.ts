# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\utils\memory\versions.ts
# Merge Date: 2026-05-07T19:17:28.781567
# ---

import { findGitRoot } from '../git.js'

// Note: This is used to check git repo status synchronously
// Uses findGitRoot which walks the filesystem (no subprocess)
// Prefer `dirIsInGitRepo()` for async checks
export function projectIsInGitRepo(cwd: string): boolean {
  return findGitRoot(cwd) !== null
}

