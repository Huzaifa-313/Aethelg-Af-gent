# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\utils\plugins\officialMarketplace.ts
# Merge Date: 2026-05-07T19:19:50.270696
# ---

/**
 * Constants for the official Anthropic plugins marketplace.
 *
 * The official marketplace is hosted on GitHub and provides first-party
 * plugins developed by Anthropic. This file defines the constants needed
 * to install and identify this marketplace.
 */

import type { MarketplaceSource } from './schemas.js'

/**
 * Source configuration for the official Anthropic plugins marketplace.
 * Used when auto-installing the marketplace on startup.
 */
export const OFFICIAL_MARKETPLACE_SOURCE = {
  source: 'github',
  repo: 'anthropics/claude-plugins-official',
} as const satisfies MarketplaceSource

/**
 * Display name for the official marketplace.
 * This is the name under which the marketplace will be registered
 * in the known_marketplaces.json file.
 */
export const OFFICIAL_MARKETPLACE_NAME = 'claude-plugins-official'
