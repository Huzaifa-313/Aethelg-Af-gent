# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\utils\configConstants.ts
# Merge Date: 2026-05-07T19:15:07.689459
# ---

// These constants are in a separate file to avoid circular dependency issues.
// Do NOT add imports to this file - it must remain dependency-free.

export const NOTIFICATION_CHANNELS = [
  'auto',
  'iterm2',
  'iterm2_with_bell',
  'terminal_bell',
  'kitty',
  'ghostty',
  'notifications_disabled',
] as const

// Valid editor modes (excludes deprecated 'emacs' which is auto-migrated to 'normal')
export const EDITOR_MODES = ['normal', 'vim'] as const

// Valid teammate modes for spawning
// 'tmux' = traditional tmux-based teammates
// 'in-process' = in-process teammates running in same process
// 'auto' = automatically choose based on context (default)
export const TEAMMATE_MODES = ['auto', 'tmux', 'in-process'] as const
