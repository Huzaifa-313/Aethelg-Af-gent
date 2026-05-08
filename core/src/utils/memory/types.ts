# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\utils\memory\types.ts
# Merge Date: 2026-05-07T19:17:28.764569
# ---

import { feature } from 'bun:bundle'

export const MEMORY_TYPE_VALUES = [
  'User',
  'Project',
  'Local',
  'Managed',
  'AutoMem',
  ...(feature('TEAMMEM') ? (['TeamMem'] as const) : []),
] as const

export type MemoryType = (typeof MEMORY_TYPE_VALUES)[number]

