# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\constants\querySource.ts
# Merge Date: 2026-05-07T19:16:53.430455
# ---

/**
 * QuerySource identifies where a query originated from.
 * Used for analytics, retry logic, and cache control decisions.
 */
export type QuerySource =
  | 'repl_main_thread'
  | 'sdk'
  | 'compact'
  | 'side_question'
  | 'agent'
  | 'agent:custom'
  | 'agent:explore'
  | 'agent:plan'
  | 'tool_use_summary'
  | 'advisor'
  | 'hook'
  | 'session_memory'
  | 'magic_docs'
  | 'skill_search'
  | 'classifier'
  | 'bridge'
  | (string & {}) // Allow other string values for extensibility
