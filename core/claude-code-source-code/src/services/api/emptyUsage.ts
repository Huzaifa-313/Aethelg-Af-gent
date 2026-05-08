# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\services\api\emptyUsage.ts
# Merge Date: 2026-05-07T19:18:21.524686
# ---

import type { NonNullableUsage } from '../../entrypoints/sdk/sdkUtilityTypes.js'

/**
 * Zero-initialized usage object. Extracted from logging.ts so that
 * bridge/replBridge.ts can import it without transitively pulling in
 * api/errors.ts → utils/messages.ts → BashTool.tsx → the world.
 */
export const EMPTY_USAGE: Readonly<NonNullableUsage> = {
  input_tokens: 0,
  cache_creation_input_tokens: 0,
  cache_read_input_tokens: 0,
  output_tokens: 0,
  server_tool_use: { web_search_requests: 0, web_fetch_requests: 0 },
  service_tier: 'standard',
  cache_creation: {
    ephemeral_1h_input_tokens: 0,
    ephemeral_5m_input_tokens: 0,
  },
  inference_geo: '',
  iterations: [],
  speed: 'standard',
}
