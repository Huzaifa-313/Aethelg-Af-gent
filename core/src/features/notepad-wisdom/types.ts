# AETHELGARD MERGED FILE
# Origin Repository: oh-my-claudecode-main
# Original Path: src\features\notepad-wisdom\types.ts
# Merge Date: 2026-05-07T19:21:21.692723
# ---

/**
 * Notepad Wisdom Types
 *
 * Types for plan-scoped notepad wisdom system.
 */

export interface WisdomEntry {
  timestamp: string;
  content: string;
}

export type WisdomCategory = 'learnings' | 'decisions' | 'issues' | 'problems';

export interface PlanWisdom {
  planName: string;
  learnings: WisdomEntry[];
  decisions: WisdomEntry[];
  issues: WisdomEntry[];
  problems: WisdomEntry[];
}
