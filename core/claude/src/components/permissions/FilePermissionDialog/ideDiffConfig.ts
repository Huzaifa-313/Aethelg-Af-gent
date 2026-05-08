# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\components\permissions\FilePermissionDialog\ideDiffConfig.ts
# Merge Date: 2026-05-07T19:14:44.118457
# ---

import type { ToolInput } from './useFilePermissionDialog.js'

export interface FileEdit {
  old_string: string
  new_string: string
  replace_all?: boolean
}

export interface IDEDiffConfig {
  filePath: string
  edits?: FileEdit[]
  editMode?: 'single' | 'multiple'
}

export interface IDEDiffChangeInput {
  file_path: string
  edits: FileEdit[]
}

export interface IDEDiffSupport<TInput extends ToolInput> {
  getConfig(input: TInput): IDEDiffConfig
  applyChanges(input: TInput, modifiedEdits: FileEdit[]): TInput
}

export function createSingleEditDiffConfig(
  filePath: string,
  oldString: string,
  newString: string,
  replaceAll?: boolean,
): IDEDiffConfig {
  return {
    filePath,
    edits: [
      {
        old_string: oldString,
        new_string: newString,
        replace_all: replaceAll,
      },
    ],
    editMode: 'single',
  }
}
