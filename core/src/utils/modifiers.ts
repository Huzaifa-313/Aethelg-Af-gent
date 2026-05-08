# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\utils\modifiers.ts
# Merge Date: 2026-05-07T19:17:22.239567
# ---

export type ModifierKey = 'shift' | 'command' | 'control' | 'option'

let prewarmed = false

/**
 * Pre-warm the native module by loading it in advance.
 * Call this early to avoid delay on first use.
 */
export function prewarmModifiers(): void {
  if (prewarmed || process.platform !== 'darwin') {
    return
  }
  prewarmed = true
  // Load module in background
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { prewarm } = require('modifiers-napi') as { prewarm: () => void }
    prewarm()
  } catch {
    // Ignore errors during prewarm
  }
}

/**
 * Check if a specific modifier key is currently pressed (synchronous).
 */
export function isModifierPressed(modifier: ModifierKey): boolean {
  if (process.platform !== 'darwin') {
    return false
  }
  // Dynamic import to avoid loading native module at top level
  const { isModifierPressed: nativeIsModifierPressed } =
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('modifiers-napi') as { isModifierPressed: (m: string) => boolean }
  return nativeIsModifierPressed(modifier)
}

