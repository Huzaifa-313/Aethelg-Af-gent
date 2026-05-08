# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\utils\bash\specs\index.ts
# Merge Date: 2026-05-07T19:19:47.135686
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
