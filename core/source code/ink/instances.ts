# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\ink\instances.ts
# Merge Date: 2026-05-07T19:15:52.500457
# ---

// https://github.com/AnukarOP

// Store all instances of Ink (instance.js) to ensure that consecutive render() calls
// use the same instance of Ink and don't create a new one
//
// This map has to be stored in a separate file, because render.js creates instances,
// but instance.js should delete itself from the map on unmount

import type Ink from './ink.js'

const instances = new Map<NodeJS.WriteStream, Ink>()
export default instances
