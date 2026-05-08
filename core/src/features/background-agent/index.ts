# AETHELGARD MERGED FILE
# Origin Repository: oh-my-claudecode-main
# Original Path: src\features\background-agent\index.ts
# Merge Date: 2026-05-07T19:21:20.549803
# ---

/**
 * Background Agent Feature
 *
 * Manages background tasks for the OMC multi-agent system.
 * Provides concurrency control and task state management.
 *
 * Adapted from oh-my-opencode's background-agent feature.
 */

export * from './types.js';
export { BackgroundManager, getBackgroundManager, resetBackgroundManager } from './manager.js';
export { ConcurrencyManager } from './concurrency.js';
