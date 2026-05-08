# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: src\projectOnboardingSteps.ts
# Merge Date: 2026-05-07T19:21:49.172308
# ---

import { getCwd } from './utils/cwd.js'
import { isDirEmpty } from './utils/file.js'
import { getFsImplementation } from './utils/fsOperations.js'
import { findProjectInstructionFilePathInAncestors } from './utils/projectInstructions.js'

export type Step = {
  key: string
  text: string
  isComplete: boolean
  isCompletable: boolean
  isEnabled: boolean
}

export function getSteps(): Step[] {
  const hasRepoInstructions =
    findProjectInstructionFilePathInAncestors(
      getCwd(),
      getFsImplementation().existsSync,
    ) !== null
  const isWorkspaceDirEmpty = isDirEmpty(getCwd())

  return [
    {
      key: 'workspace',
      text: 'Ask Claude to create a new app or clone a repository',
      isComplete: false,
      isCompletable: true,
      isEnabled: isWorkspaceDirEmpty,
    },
    {
      key: 'claudemd',
      text: 'Set up repo instructions (/init creates AGENTS.md or updates existing CLAUDE.md; either file counts)',
      isComplete: hasRepoInstructions,
      isCompletable: true,
      isEnabled: !isWorkspaceDirEmpty,
    },
  ]
}

export function isProjectOnboardingComplete(): boolean {
  return getSteps()
    .filter(({ isCompletable, isEnabled }) => isCompletable && isEnabled)
    .every(({ isComplete }) => isComplete)
}
