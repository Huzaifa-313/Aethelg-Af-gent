# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\constants\keys.ts
# Merge Date: 2026-05-07T19:18:13.128123
# ---

import { isEnvTruthy } from '../utils/envUtils.js'

// Lazy read so ENABLE_GROWTHBOOK_DEV from globalSettings.env (applied after
// module load) is picked up. USER_TYPE is a build-time define so it's safe.
export function getGrowthBookClientKey(): string {
  return process.env.USER_TYPE === 'ant'
    ? isEnvTruthy(process.env.ENABLE_GROWTHBOOK_DEV)
      ? 'sdk-yZQvlplybuXjYh6L'
      : 'sdk-xRVcrliHIlrg4og4'
    : 'sdk-zAZezfDKGoZuXXKe'
}
