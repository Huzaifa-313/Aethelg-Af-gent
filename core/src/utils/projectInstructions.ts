# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: src\utils\projectInstructions.ts
# Merge Date: 2026-05-07T19:21:53.579314
# ---

import { dirname, join } from 'path'

export const PRIMARY_PROJECT_INSTRUCTION_FILE = 'AGENTS.md'
export const FALLBACK_PROJECT_INSTRUCTION_FILE = 'CLAUDE.md'

export function getProjectInstructionFilePaths(dir: string): string[] {
  return [
    join(dir, PRIMARY_PROJECT_INSTRUCTION_FILE),
    join(dir, FALLBACK_PROJECT_INSTRUCTION_FILE),
  ]
}

export function getProjectInstructionFilePath(
  dir: string,
  existsSync: (path: string) => boolean,
): string {
  const [primaryPath, fallbackPath] = getProjectInstructionFilePaths(dir)
  return existsSync(primaryPath)
    ? primaryPath
    : fallbackPath
}

export function hasProjectInstructionFile(
  dir: string,
  existsSync: (path: string) => boolean,
): boolean {
  return getProjectInstructionFilePaths(dir).some(path => existsSync(path))
}

export function findProjectInstructionFilePathInAncestors(
  startDir: string,
  existsSync: (path: string) => boolean,
): string | null {
  let currentDir = startDir

  while (true) {
    if (hasProjectInstructionFile(currentDir, existsSync)) {
      return getProjectInstructionFilePath(currentDir, existsSync)
    }

    const parentDir = dirname(currentDir)
    if (parentDir === currentDir) {
      return null
    }

    currentDir = parentDir
  }
}

export function isProjectInstructionFileName(name: string): boolean {
  return (
    name === PRIMARY_PROJECT_INSTRUCTION_FILE ||
    name === FALLBACK_PROJECT_INSTRUCTION_FILE
  )
}
