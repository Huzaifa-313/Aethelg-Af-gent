# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\query\transitions.ts
# Merge Date: 2026-05-07T19:17:01.452456
# ---

/**
 * Transition types for the query loop.
 *
 * Terminal: why the loop exited (returned).
 * Continue: why the loop continued to the next iteration (not returned).
 */

/** Terminal transition — the query loop returned. */
export type Terminal = {
  reason:
    | 'completed'
    | 'blocking_limit'
    | 'image_error'
    | 'model_error'
    | 'aborted_streaming'
    | 'aborted_tools'
    | 'prompt_too_long'
    | 'stop_hook_prevented'
    | 'hook_stopped'
    | 'max_turns'
    | (string & {})
  error?: unknown
}

/** Continue transition — the loop will iterate again. */
export type Continue = {
  reason:
    | 'tool_use'
    | 'reactive_compact_retry'
    | 'max_output_tokens_recovery'
    | 'max_output_tokens_escalate'
    | 'collapse_drain_retry'
    | 'stop_hook_blocking'
    | 'token_budget_continuation'
    | 'queued_command'
    | (string & {})
}
