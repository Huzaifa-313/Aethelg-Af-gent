# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\ink\components\AppContext.ts
# Merge Date: 2026-05-07T19:16:58.821454
# ---

import { createContext } from 'react'

export type Props = {
  /**
   * Exit (unmount) the whole Ink app.
   */
  readonly exit: (error?: Error) => void
}

/**
 * `AppContext` is a React context, which exposes a method to manually exit the app (unmount).
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
const AppContext = createContext<Props>({
  exit() {},
})

// eslint-disable-next-line custom-rules/no-top-level-side-effects
AppContext.displayName = 'InternalAppContext'

export default AppContext

