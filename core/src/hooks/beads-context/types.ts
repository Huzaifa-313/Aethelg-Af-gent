# AETHELGARD MERGED FILE
# Origin Repository: oh-my-claudecode-main
# Original Path: src\hooks\beads-context\types.ts
# Merge Date: 2026-05-07T19:21:23.715726
# ---

export type TaskTool = 'builtin' | 'beads' | 'beads-rust';

export interface BeadsContextConfig {
  taskTool: TaskTool;
  injectInstructions: boolean;
  useMcp: boolean;
}
