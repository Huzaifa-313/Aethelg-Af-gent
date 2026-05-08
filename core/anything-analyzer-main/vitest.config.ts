# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: anything-analyzer-main\vitest.config.ts
# Merge Date: 2026-05-07T19:29:14.984103
# ---

import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    alias: {
      '@shared': resolve(__dirname, 'src/shared')
    }
  }
})
