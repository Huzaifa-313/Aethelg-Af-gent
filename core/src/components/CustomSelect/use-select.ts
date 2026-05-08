# AETHELGARD MERGED FILE
# Origin Repository: claude-code5
# Original Path: src\components\CustomSelect\use-select.ts
# Merge Date: 2026-05-07T19:17:45.097124
# ---

import { useInput } from 'ink'
import { type SelectState } from './use-select-state.js'

export type UseSelectProps = {
  /**
   * When disabled, user input is ignored.
   *
   * @default false
   */
  isDisabled?: boolean

  /**
   * Select state.
   */
  state: SelectState
}

export const useSelect = ({ isDisabled = false, state }: UseSelectProps) => {
  useInput(
    (_input, key) => {
      if (key.downArrow) {
        state.focusNextOption()
      }

      if (key.upArrow) {
        state.focusPreviousOption()
      }

      if (key.return) {
        state.selectFocusedOption()
      }
    },
    { isActive: !isDisabled },
  )
}
