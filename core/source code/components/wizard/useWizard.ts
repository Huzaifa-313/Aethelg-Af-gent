# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\components\wizard\useWizard.ts
# Merge Date: 2026-05-07T19:15:46.921456
# ---

// https://github.com/AnukarOP

import { useContext } from 'react'
import type { WizardContextValue } from './types.js'
import { WizardContext } from './WizardProvider.js'

export function useWizard<
  T extends Record<string, unknown> = Record<string, unknown>,
>(): WizardContextValue<T> {
  const context = useContext(WizardContext) as WizardContextValue<T> | null
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider')
  }
  return context
}
