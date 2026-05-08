# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: BrowserPilot-main\frontend\src\main.tsx
# Merge Date: 2026-05-07T19:29:23.383105
# ---

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
