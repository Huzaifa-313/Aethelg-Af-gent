# AETHELGARD MERGED FILE
# Origin Repository: claude-code5
# Original Path: src\commands\clear.ts
# Merge Date: 2026-05-07T19:17:44.505124
# ---

import { Command } from '../commands.js'
import { getMessagesSetter } from '../messages.js'
import { getContext } from '../context.js'
import { getCodeStyle } from '../utils/style.js'
import { clearTerminal } from '../utils/terminal.js'
import { getOriginalCwd, setCwd } from '../utils/state.js'
import { Message } from '../query.js'

export async function clearConversation(context: {
  setForkConvoWithMessagesOnTheNextRender: (
    forkConvoWithMessages: Message[],
  ) => void
}) {
  await clearTerminal()
  getMessagesSetter()([])
  context.setForkConvoWithMessagesOnTheNextRender([])
  getContext.cache.clear?.()
  getCodeStyle.cache.clear?.()
  await setCwd(getOriginalCwd())
}

const clear = {
  type: 'local',
  name: 'clear',
  description: 'Clear conversation history and free up context',
  isEnabled: true,
  isHidden: false,
  async call(_, context) {
    clearConversation(context)
    return ''
  },
  userFacingName() {
    return 'clear'
  },
} satisfies Command

export default clear
