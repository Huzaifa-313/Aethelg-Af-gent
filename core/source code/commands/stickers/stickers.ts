# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\commands\stickers\stickers.ts
# Merge Date: 2026-05-07T19:15:31.878455
# ---

// https://github.com/AnukarOP

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
