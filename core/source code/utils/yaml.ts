# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\utils\yaml.ts
# Merge Date: 2026-05-07T19:16:19.219456
# ---

// https://github.com/AnukarOP

/**
 * YAML parsing wrapper.
 *
 * Uses Bun.YAML (built-in, zero-cost) when running under Bun, otherwise falls
 * back to the `yaml` npm package. The package is lazy-required inside the
 * non-Bun branch so native Bun builds never load the ~270KB yaml parser.
 */

export function parseYaml(input: string): unknown {
  if (typeof Bun !== 'undefined') {
    return Bun.YAML.parse(input)
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return (require('yaml') as typeof import('yaml')).parse(input)
}
