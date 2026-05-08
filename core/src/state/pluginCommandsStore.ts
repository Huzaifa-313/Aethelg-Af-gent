# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: src\state\pluginCommandsStore.ts
# Merge Date: 2026-05-07T19:21:52.336304
# ---

import type { Command } from '../commands.js'
import { createStore } from './store.js'

const pluginCommandsStore = createStore<Command[]>([])

export const getPluginCommandsState = (): Command[] =>
  pluginCommandsStore.getState()

export const subscribePluginCommands = pluginCommandsStore.subscribe

export function setPluginCommandsState(commands: Command[]): void {
  pluginCommandsStore.setState(() => [...commands])
}
