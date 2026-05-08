# AETHELGARD MERGED FILE
# Origin Repository: everything-claude-code-main
# Original Path: scripts\hooks\check-hook-enabled.js
# Merge Date: 2026-05-07T19:20:19.525206
# ---

#!/usr/bin/env node
'use strict';

const { isHookEnabled } = require('../lib/hook-flags');

const [, , hookId, profilesCsv] = process.argv;
if (!hookId) {
  process.stdout.write('yes');
  process.exit(0);
}

process.stdout.write(isHookEnabled(hookId, { profiles: profilesCsv }) ? 'yes' : 'no');
