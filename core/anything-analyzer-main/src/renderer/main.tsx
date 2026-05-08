# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: anything-analyzer-main\src\renderer\main.tsx
# Merge Date: 2026-05-07T19:29:17.060105
# ---

import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastProvider } from './ui/Toast'
import App from './App'
import './styles/tokens.css'
import './styles/themes/index.css'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>
)
