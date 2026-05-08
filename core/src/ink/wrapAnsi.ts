# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\ink\wrapAnsi.ts
# Merge Date: 2026-05-07T19:16:58.703456
# ---

import wrapAnsiNpm from 'wrap-ansi'

type WrapAnsiOptions = {
  hard?: boolean
  wordWrap?: boolean
  trim?: boolean
}

const wrapAnsiBun =
  typeof Bun !== 'undefined' && typeof Bun.wrapAnsi === 'function'
    ? Bun.wrapAnsi
    : null

const wrapAnsi: (
  input: string,
  columns: number,
  options?: WrapAnsiOptions,
) => string = wrapAnsiBun ?? wrapAnsiNpm

export { wrapAnsi }

