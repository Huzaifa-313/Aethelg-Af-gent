# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\utils\worktreeModeEnabled.ts
# Merge Date: 2026-05-07T19:16:19.154454
# ---

// https://github.com/AnukarOP

/**
 * Worktree mode is now unconditionally enabled for all users.
 *
 * Previously gated by GrowthBook flag 'tengu_worktree_mode', but the
 * CACHED_MAY_BE_STALE pattern returns the default (false) on first launch
 * before the cache is populated, silently swallowing --worktree.
 * See https://github.com/anthropics/claude-code/issues/27044.
 */
export function isWorktreeModeEnabled(): boolean {
  return true
}
