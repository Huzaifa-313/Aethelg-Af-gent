# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: after-effects-automation-main\ae_automation\mixins\videoEditor\vite.config.js
# Merge Date: 2026-05-07T19:26:21.470430
# ---

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Determine if we're building for demo mode (GitHub Pages)
const isDemoMode = process.env.VITE_DEMO_MODE === 'true'
console.log('Building in demo mode:', isDemoMode)

export default defineConfig({
  // Base path for GitHub Pages (repository name)
  base: isDemoMode ? '/after-effects-automation/' : '/',

  plugins: [react()],

  // Define environment variables
  define: {
    'import.meta.env.VITE_DEMO_MODE': JSON.stringify(isDemoMode)
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'react-icons']
        }
      }
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  }
})
