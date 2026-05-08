# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\commands\doctor\index.ts
# Merge Date: 2026-05-07T19:17:55.568124
# ---

import type { Command } from '../../commands.js'
import { isEnvTruthy } from '../../utils/envUtils.js'

const doctor: Command = {
  name: 'doctor',
  description: 'Diagnose and verify your Claude Code installation and settings',
  isEnabled: () => !isEnvTruthy(process.env.DISABLE_DOCTOR_COMMAND),
  type: 'local-jsx',
  load: () => import('./doctor.js'),
}

export default doctor
