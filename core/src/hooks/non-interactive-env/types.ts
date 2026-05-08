# AETHELGARD MERGED FILE
# Origin Repository: oh-my-claudecode-main
# Original Path: src\hooks\non-interactive-env\types.ts
# Merge Date: 2026-05-07T19:21:25.017726
# ---

export interface NonInteractiveEnvConfig {
  disabled?: boolean
}

/**
 * Shell hook interface for command interception
 */
export interface ShellHook {
  name: string
  beforeCommand?(command: string): Promise<{ command: string; warning?: string }>
}
