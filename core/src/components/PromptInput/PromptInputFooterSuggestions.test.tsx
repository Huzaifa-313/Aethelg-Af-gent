# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: src\components\PromptInput\PromptInputFooterSuggestions.test.tsx
# Merge Date: 2026-05-07T19:21:50.165307
# ---

import figures from 'figures'
import { describe, expect, it } from 'bun:test'
import { renderToString } from '../../utils/staticRender.js'
import {
  PromptInputFooterSuggestions,
  type SuggestionItem,
} from './PromptInputFooterSuggestions.js'

describe('PromptInputFooterSuggestions', () => {
  it('renders a visible marker for the selected suggestion', async () => {
    const suggestions: SuggestionItem[] = [
      {
        id: 'command-help',
        displayText: '/help',
        description: 'Show help',
      },
      {
        id: 'command-doctor',
        displayText: '/doctor',
        description: 'Run diagnostics',
      },
    ]

    const output = await renderToString(
      <PromptInputFooterSuggestions
        suggestions={suggestions}
        selectedSuggestion={1}
      />,
      80,
    )

    expect(output).toContain(`${figures.pointer} /doctor`)
    expect(output).toContain('  /help')
  })
})
