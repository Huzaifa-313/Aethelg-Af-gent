# AETHELGARD MERGED FILE
# Origin Repository: thepopebot-1.2.72
# Original Path: drizzle.config.js
# Merge Date: 2026-05-07T19:25:09.449464
# ---

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db/schema.js',
  out: './drizzle',
  dialect: 'sqlite',
});
