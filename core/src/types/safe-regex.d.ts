# AETHELGARD MERGED FILE
# Origin Repository: oh-my-claudecode-main
# Original Path: src\types\safe-regex.d.ts
# Merge Date: 2026-05-07T19:21:40.568305
# ---

declare module "safe-regex" {
  function safe(re: string | RegExp, opts?: { limit?: number }): boolean;
  export default safe;
}
