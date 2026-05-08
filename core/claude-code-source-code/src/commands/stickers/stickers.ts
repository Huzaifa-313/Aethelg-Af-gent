# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\commands\stickers\stickers.ts
# Merge Date: 2026-05-07T19:17:58.433124
# ---

import type { LocalCommandResult } from '../../types/command.js'
import { openBrowser } from '../../utils/browser.js'

export async function call(): Promise<LocalCommandResult> {
  const url = 'https://www.stickermule.com/claudecode'
  const success = await openBrowser(url)

  if (success) {
    return { type: 'text', value: 'Opening sticker page in browser…' }
  } else {
    return {
      type: 'text',
      value: `Failed to open browser. Visit: ${url}`,
    }
  }
}
