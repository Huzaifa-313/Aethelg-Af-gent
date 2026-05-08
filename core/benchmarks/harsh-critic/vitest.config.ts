# AETHELGARD MERGED FILE
# Origin Repository: oh-my-claudecode-main
# Original Path: benchmarks\harsh-critic\vitest.config.ts
# Merge Date: 2026-05-07T19:21:11.991810
# ---

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 30000,
    include: ['scoring/__tests__/*.test.ts'],
  },
});
