# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\shims\preload.ts
# Merge Date: 2026-05-07T19:17:10.936567
# ---

// src/shims/preload.ts
// Must be loaded before any application code.
// Provides runtime equivalents of Bun bundler build-time features.

import './macro.js'
// bun:bundle is resolved via the build alias, not imported here
