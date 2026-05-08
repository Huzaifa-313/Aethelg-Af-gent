# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\utils\keyboardShortcuts.ts
# Merge Date: 2026-05-07T19:15:10.437457
# ---

// Special characters that macOS Option+key produces, mapped to their
// keybinding equivalents. Used to detect Option+key shortcuts on macOS
// terminals that don't have "Option as Meta" enabled.
export const MACOS_OPTION_SPECIAL_CHARS = {
  '†': 'alt+t', // Option+T -> thinking toggle
  π: 'alt+p', // Option+P -> model picker
  ø: 'alt+o', // Option+O -> fast mode
} as const satisfies Record<string, string>

export function isMacosOptionChar(
  char: string,
): char is keyof typeof MACOS_OPTION_SPECIAL_CHARS {
  return char in MACOS_OPTION_SPECIAL_CHARS
}
