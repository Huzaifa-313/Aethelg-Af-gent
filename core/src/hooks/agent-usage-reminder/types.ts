# AETHELGARD MERGED FILE
# Origin Repository: oh-my-claudecode-main
# Original Path: src\hooks\agent-usage-reminder\types.ts
# Merge Date: 2026-05-07T19:21:22.788721
# ---

/**
 * Agent Usage Reminder Types
 *
 * Tracks agent usage to encourage delegation to specialized agents.
 *
 * Ported from oh-my-opencode's agent-usage-reminder hook.
 */

export interface AgentUsageState {
  sessionID: string;
  agentUsed: boolean;
  reminderCount: number;
  updatedAt: number;
}
