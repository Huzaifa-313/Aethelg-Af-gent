# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: src\services\wiki\paths.ts
# Merge Date: 2026-05-07T19:21:52.208306
# ---

import { join } from 'path'
import type { WikiPaths } from './types.js'

export const OPENCLAUDE_DIRNAME = '.openclaude'
export const WIKI_DIRNAME = 'wiki'

export function getWikiPaths(cwd: string): WikiPaths {
  const root = join(cwd, OPENCLAUDE_DIRNAME, WIKI_DIRNAME)

  return {
    root,
    pagesDir: join(root, 'pages'),
    sourcesDir: join(root, 'sources'),
    schemaFile: join(root, 'schema.md'),
    indexFile: join(root, 'index.md'),
    logFile: join(root, 'log.md'),
  }
}
