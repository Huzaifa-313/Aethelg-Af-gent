# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: web\components\notifications\ToastProvider.tsx
# Merge Date: 2026-05-07T19:17:40.759123
# ---

"use client";

import { ToastStack } from "./ToastStack";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastStack />
    </>
  );
}
