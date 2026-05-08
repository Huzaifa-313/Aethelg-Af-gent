# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\utils\commandLifecycle.ts
# Merge Date: 2026-05-07T19:15:07.534456
# ---

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
