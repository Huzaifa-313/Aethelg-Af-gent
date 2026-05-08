# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

/** Detect if text contains structured markdown (code blocks, headings, lists, tables) */
export function isStructuredMarkdown(text: string): boolean {
  if (!text) return false
  return /```/.test(text)
    || /^#{1,4}\s/m.test(text)
    || /^[-*]\s/m.test(text)
    || /^\d+\.\s/m.test(text)
    || /\|.*\|.*\|/m.test(text)
}
