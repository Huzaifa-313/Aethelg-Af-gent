# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\ink\events\terminal-focus-event.ts
# Merge Date: 2026-05-07T19:18:18.660687
# ---

import { Event } from './event.js'

export type TerminalFocusEventType = 'terminalfocus' | 'terminalblur'

/**
 * Event fired when the terminal window gains or loses focus.
 *
 * Uses DECSET 1004 focus reporting - the terminal sends:
 * - CSI I (\x1b[I) when the terminal gains focus
 * - CSI O (\x1b[O) when the terminal loses focus
 */
export class TerminalFocusEvent extends Event {
  readonly type: TerminalFocusEventType

  constructor(type: TerminalFocusEventType) {
    super()
    this.type = type
  }
}
