# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: BrowserPilot-main\frontend\vite.config.ts
# Merge Date: 2026-05-07T19:29:23.316103
# ---

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
