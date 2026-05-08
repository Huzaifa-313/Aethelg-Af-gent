# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: src\services\wiki\types.ts
# Merge Date: 2026-05-07T19:21:52.253305
# ---

export type WikiPaths = {
  root: string
  pagesDir: string
  sourcesDir: string
  schemaFile: string
  indexFile: string
  logFile: string
}

export type WikiInitResult = {
  root: string
  createdFiles: string[]
  createdDirectories: string[]
  alreadyExisted: boolean
}

export type WikiStatus = {
  initialized: boolean
  root: string
  pageCount: number
  sourceCount: number
  hasSchema: boolean
  hasIndex: boolean
  hasLog: boolean
  lastUpdatedAt: string | null
}

export type WikiIngestResult = {
  sourceFile: string
  sourceNote: string
  summary: string
  title: string
}
