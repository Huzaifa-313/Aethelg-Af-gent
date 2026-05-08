# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\skills\bundled\verifyContent.ts
# Merge Date: 2026-05-07T19:15:00.250454
# ---

// Content for the verify bundled skill.
// Each .md file is inlined as a string at build time via Bun's text loader.

import cliMd from './verify/examples/cli.md'
import serverMd from './verify/examples/server.md'
import skillMd from './verify/SKILL.md'

export const SKILL_MD: string = skillMd

export const SKILL_FILES: Record<string, string> = {
  'examples/cli.md': cliMd,
  'examples/server.md': serverMd,
}
