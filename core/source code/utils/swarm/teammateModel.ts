# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\utils\swarm\teammateModel.ts
# Merge Date: 2026-05-07T19:16:28.579457
# ---

// https://github.com/AnukarOP

import { CLAUDE_OPUS_4_6_CONFIG } from '../model/configs.js'
import { getAPIProvider } from '../model/providers.js'

// @[MODEL LAUNCH]: Update the fallback model below.
// When the user has never set teammateDefaultModel in /config, new teammates
// use Opus 4.6. Must be provider-aware so Bedrock/Vertex/Foundry customers get
// the correct model ID.
export function getHardcodedTeammateModelFallback(): string {
  return CLAUDE_OPUS_4_6_CONFIG[getAPIProvider()]
}
