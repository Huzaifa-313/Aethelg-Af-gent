# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: next.config.ts
# Merge Date: 2026-05-07T19:14:26.811458
# ---

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /** Faster SSG when pre-rendering thousands of /docs/claude-src/file/* pages */
    staticGenerationMaxConcurrency: 8,
    staticGenerationMinPagesPerWorker: 50,
  },
};

export default nextConfig;
