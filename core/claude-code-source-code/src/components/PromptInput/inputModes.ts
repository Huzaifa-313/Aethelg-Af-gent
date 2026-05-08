# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\components\PromptInput\inputModes.ts
# Merge Date: 2026-05-07T19:18:10.459125
# ---

import type { HistoryMode } from 'src/hooks/useArrowKeyHistory.js'
import type { PromptInputMode } from 'src/types/textInputTypes.js'

export function prependModeCharacterToInput(
  input: string,
  mode: PromptInputMode,
): string {
  switch (mode) {
    case 'bash':
      return `!${input}`
    default:
      return input
  }
}

export function getModeFromInput(input: string): HistoryMode {
  if (input.startsWith('!')) {
    return 'bash'
  }
  return 'prompt'
}

export function getValueFromInput(input: string): string {
  const mode = getModeFromInput(input)
  if (mode === 'prompt') {
    return input
  }
  return input.slice(1)
}

export function isInputModeCharacter(input: string): boolean {
  return input === '!'
}
