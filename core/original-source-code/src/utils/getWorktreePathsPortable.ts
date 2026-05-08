# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\utils\getWorktreePathsPortable.ts
# Merge Date: 2026-05-07T19:19:42.328687
# ---

import { execFile as execFileCb } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFileCb)

/**
 * Portable worktree detection using only child_process — no analytics,
 * no bootstrap deps, no execa. Used by listSessionsImpl.ts (SDK) and
 * anywhere that needs worktree paths without pulling in the CLI
 * dependency chain (execa → cross-spawn → which).
 */
export async function getWorktreePathsPortable(cwd: string): Promise<string[]> {
  try {
    const { stdout } = await execFileAsync(
      'git',
      ['worktree', 'list', '--porcelain'],
      { cwd, timeout: 5000 },
    )
    if (!stdout) return []
    return stdout
      .split('\n')
      .filter(line => line.startsWith('worktree '))
      .map(line => line.slice('worktree '.length).normalize('NFC'))
  } catch {
    return []
  }
}
