# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\utils\commandLifecycle.ts
# Merge Date: 2026-05-07T19:16:11.284455
# ---

// https://github.com/AnukarOP

type CommandLifecycleState = 'started' | 'completed'

type CommandLifecycleListener = (
  uuid: string,
  state: CommandLifecycleState,
) => void

let listener: CommandLifecycleListener | null = null

export function setCommandLifecycleListener(
  cb: CommandLifecycleListener | null,
): void {
  listener = cb
}

export function notifyCommandLifecycle(
  uuid: string,
  state: CommandLifecycleState,
): void {
  listener?.(uuid, state)
}
