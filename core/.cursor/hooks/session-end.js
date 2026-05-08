# AETHELGARD MERGED FILE
# Origin Repository: everything-claude-code-main
# Original Path: .cursor\hooks\session-end.js
# Merge Date: 2026-05-07T19:19:57.043687
# ---

#!/usr/bin/env node
const { readStdin, runExistingHook, transformToClaude, hookEnabled } = require('./adapter');
readStdin().then(raw => {
  const input = JSON.parse(raw || '{}');
  const claudeInput = transformToClaude(input);
  if (hookEnabled('session:end:marker', ['minimal', 'standard', 'strict'])) {
    runExistingHook('session-end-marker.js', claudeInput);
  }
  process.stdout.write(raw);
}).catch(() => process.exit(0));
