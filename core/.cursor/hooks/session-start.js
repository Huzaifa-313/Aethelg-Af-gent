# AETHELGARD MERGED FILE
# Origin Repository: everything-claude-code-main
# Original Path: .cursor\hooks\session-start.js
# Merge Date: 2026-05-07T19:19:57.065685
# ---

#!/usr/bin/env node
const { readStdin, runExistingHook, transformToClaude, hookEnabled } = require('./adapter');
readStdin().then(raw => {
  const input = JSON.parse(raw || '{}');
  const claudeInput = transformToClaude(input);
  if (hookEnabled('session:start', ['minimal', 'standard', 'strict'])) {
    runExistingHook('session-start.js', claudeInput);
  }
  process.stdout.write(raw);
}).catch(() => process.exit(0));
