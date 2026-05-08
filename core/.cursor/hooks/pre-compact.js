# AETHELGARD MERGED FILE
# Origin Repository: everything-claude-code-main
# Original Path: .cursor\hooks\pre-compact.js
# Merge Date: 2026-05-07T19:19:57.020691
# ---

#!/usr/bin/env node
const { readStdin, runExistingHook, transformToClaude } = require('./adapter');
readStdin().then(raw => {
  const claudeInput = JSON.parse(raw || '{}');
  runExistingHook('pre-compact.js', transformToClaude(claudeInput));
  process.stdout.write(raw);
}).catch(() => process.exit(0));
