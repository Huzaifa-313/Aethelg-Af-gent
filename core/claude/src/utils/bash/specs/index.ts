# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\utils\bash\specs\index.ts
# Merge Date: 2026-05-07T19:15:16.061458
# ---

import type { CommandSpec } from '../registry.js'
import alias from './alias.js'
import nohup from './nohup.js'
import pyright from './pyright.js'
import sleep from './sleep.js'
import srun from './srun.js'
import time from './time.js'
import timeout from './timeout.js'

export default [
  pyright,
  timeout,
  sleep,
  alias,
  nohup,
  time,
  srun,
] satisfies CommandSpec[]
