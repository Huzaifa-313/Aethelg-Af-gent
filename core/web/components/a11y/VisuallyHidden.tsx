# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: web\components\a11y\VisuallyHidden.tsx
# Merge Date: 2026-05-07T19:17:39.629126
# ---

import type { ReactNode } from "react";

interface VisuallyHiddenProps {
  children: ReactNode;
  /** When true, renders as a span inline; defaults to span */
  as?: "span" | "div" | "p";
}

/**
 * Visually hides content while keeping it accessible to screen readers.
 * Use for icon-only buttons, supplemental context, etc.
 */
export function VisuallyHidden({ children, as: Tag = "span" }: VisuallyHiddenProps) {
  return (
    <Tag
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
      }}
    >
      {children}
    </Tag>
  );
}
