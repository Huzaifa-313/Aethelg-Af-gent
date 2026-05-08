# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\ink\hooks\use-app.ts
# Merge Date: 2026-05-07T19:16:59.505462
# ---

import { useContext } from 'react'
import AppContext from '../components/AppContext.js'

/**
 * `useApp` is a React hook, which exposes a method to manually exit the app (unmount).
 */
const useApp = () => useContext(AppContext)
export default useApp

