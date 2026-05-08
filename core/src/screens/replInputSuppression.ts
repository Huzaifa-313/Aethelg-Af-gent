# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: src\screens\replInputSuppression.ts
# Merge Date: 2026-05-07T19:21:50.611307
# ---

export function isPromptTypingSuppressionActive(
  isPromptInputActive: boolean,
  inputValue: string,
): boolean {
  return isPromptInputActive || inputValue.trim().length > 0
}
