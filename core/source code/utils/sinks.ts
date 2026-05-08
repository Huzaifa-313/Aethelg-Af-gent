# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\utils\sinks.ts
# Merge Date: 2026-05-07T19:16:17.012456
# ---

// https://github.com/AnukarOP

import { initializeAnalyticsSink } from '../services/analytics/sink.js'
import { initializeErrorLogSink } from './errorLogSink.js'

/**
 * Attach error log and analytics sinks, draining any events queued before
 * attachment. Both inits are idempotent. Called from setup() for the default
 * command; other entrypoints (subcommands, daemon, bridge) call this directly
 * since they bypass setup().
 *
 * Leaf module — kept out of setup.ts to avoid the setup → commands → bridge
 * → setup import cycle.
 */
export function initSinks(): void {
  initializeErrorLogSink()
  initializeAnalyticsSink()
}
