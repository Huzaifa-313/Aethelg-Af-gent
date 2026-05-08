# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: web\components\mobile\MobileInput.tsx
# Merge Date: 2026-05-07T19:17:40.619126
# ---

"use client";

import { ChatInput } from "@/components/chat/ChatInput";

interface MobileInputProps {
  conversationId: string;
  /** Height of the software keyboard in px — shifts input above it */
  keyboardHeight: number;
}

/**
 * Mobile-optimised chat input wrapper.
 * Uses a paddingBottom equal to the keyboard height so the input floats
 * above the virtual keyboard without relying on position:fixed (which
 * breaks on iOS Safari when the keyboard is open).
 */
export function MobileInput({ conversationId, keyboardHeight }: MobileInputProps) {
  return (
    <div
      style={{ paddingBottom: keyboardHeight }}
      className="transition-[padding] duration-100"
    >
      <ChatInput conversationId={conversationId} />
    </div>
  );
}
