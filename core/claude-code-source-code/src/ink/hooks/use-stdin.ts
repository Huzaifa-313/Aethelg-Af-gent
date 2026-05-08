# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\ink\hooks\use-stdin.ts
# Merge Date: 2026-05-07T19:18:18.770687
# ---

import { useContext } from 'react'
import StdinContext from '../components/StdinContext.js'

/**
 * `useStdin` is a React hook, which exposes stdin stream.
 */
const useStdin = () => useContext(StdinContext)
export default useStdin
