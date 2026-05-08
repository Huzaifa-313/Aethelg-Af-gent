# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\utils\bash\registry.ts
# Merge Date: 2026-05-07T19:19:46.949685
# ---

import { memoizeWithLRU } from '../memoize.js'
import specs from './specs/index.js'

export type CommandSpec = {
  name: string
  description?: string
  subcommands?: CommandSpec[]
  args?: Argument | Argument[]
  options?: Option[]
}

export type Argument = {
  name?: string
  description?: string
  isDangerous?: boolean
  isVariadic?: boolean // repeats infinitely e.g. echo hello world
  isOptional?: boolean
  isCommand?: boolean // wrapper commands e.g. timeout, sudo
  isModule?: string | boolean // for python -m and similar module args
  isScript?: boolean // script files e.g. node script.js
}

export type Option = {
  name: string | string[]
  description?: string
  args?: Argument | Argument[]
  isRequired?: boolean
}

export async function loadFigSpec(
  command: string,
): Promise<CommandSpec | null> {
  if (!command || command.includes('/') || command.includes('\\')) return null
  if (command.includes('..')) return null
  if (command.startsWith('-') && command !== '-') return null

  try {
    const module = await import(`@withfig/autocomplete/build/${command}.js`)
    return module.default || module
  } catch {
    return null
  }
}
export const getCommandSpec = memoizeWithLRU(
  async (command: string): Promise<CommandSpec | null> => {
    const spec =
      specs.find(s => s.name === command) ||
      (await loadFigSpec(command)) ||
      null
    return spec
  },
  (command: string) => command,
)
