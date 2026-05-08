# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\ink\hooks\use-stdin.ts
# Merge Date: 2026-05-07T19:16:59.613456
# ---

import { useContext } from 'react'
import StdinContext from '../components/StdinContext.js'

/**
 * `useStdin` is a React hook, which exposes stdin stream.
 */
const useStdin = () => useContext(StdinContext)
export default useStdin

