# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\utils\telemetry\logger.ts
# Merge Date: 2026-05-07T19:17:37.569612
# ---

import type { DiagLogger } from '@opentelemetry/api'
import { logForDebugging } from '../debug.js'
import { logError } from '../log.js'
export class ClaudeCodeDiagLogger implements DiagLogger {
  error(message: string, ..._: unknown[]) {
    logError(new Error(message))
    logForDebugging(`[3P telemetry] OTEL diag error: ${message}`, {
      level: 'error',
    })
  }
  warn(message: string, ..._: unknown[]) {
    logError(new Error(message))
    logForDebugging(`[3P telemetry] OTEL diag warn: ${message}`, {
      level: 'warn',
    })
  }
  info(_message: string, ..._args: unknown[]) {
    return
  }
  debug(_message: string, ..._args: unknown[]) {
    return
  }
  verbose(_message: string, ..._args: unknown[]) {
    return
  }
}

