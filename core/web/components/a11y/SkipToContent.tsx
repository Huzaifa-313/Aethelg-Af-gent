# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: web\components\a11y\SkipToContent.tsx
# Merge Date: 2026-05-07T19:17:39.574123
# ---

"use client";

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className={[
        "sr-only focus:not-sr-only",
        "focus:fixed focus:top-4 focus:left-4 focus:z-50",
        "focus:px-4 focus:py-2 focus:rounded-md",
        "focus:bg-brand-600 focus:text-white focus:font-medium focus:text-sm",
        "focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2",
      ].join(" ")}
    >
      Skip to main content
    </a>
  );
}
