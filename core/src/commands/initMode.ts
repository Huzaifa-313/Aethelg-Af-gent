# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: src\commands\initMode.ts
# Merge Date: 2026-05-07T19:21:49.299309
# ---

import { feature } from 'bun:bundle'
import { isEnvTruthy } from '../utils/envUtils.js'

export function isNewInitEnabled(): boolean {
  if (feature('NEW_INIT')) {
    return (
      process.env.USER_TYPE === 'ant' ||
      isEnvTruthy(process.env.CLAUDE_CODE_NEW_INIT)
    )
  }

  return false
}
