# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\hooks\useDynamicConfig.ts
# Merge Date: 2026-05-07T19:19:26.348689
# ---

import React from 'react'
import { getDynamicConfig_BLOCKS_ON_INIT } from '../services/analytics/growthbook.js'

/**
 * React hook for dynamic config values.
 * Returns the default value initially, then updates when the config is fetched.
 */
export function useDynamicConfig<T>(configName: string, defaultValue: T): T {
  const [configValue, setConfigValue] = React.useState<T>(defaultValue)

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      // Prevents a test hang when using this hook in tests
      return
    }
    void getDynamicConfig_BLOCKS_ON_INIT<T>(configName, defaultValue).then(
      setConfigValue,
    )
  }, [configName, defaultValue])

  return configValue
}
