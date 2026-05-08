# AETHELGARD MERGED FILE
# Origin Repository: everything-claude-code-main
# Original Path: .cursor\hooks\subagent-start.js
# Merge Date: 2026-05-07T19:19:57.111690
# ---

#!/usr/bin/env node
const { readStdin } = require('./adapter');
readStdin().then(raw => {
  try {
    const input = JSON.parse(raw);
    const agent = input.agent_name || input.agent || 'unknown';
    console.error(`[ECC] Agent spawned: ${agent}`);
  } catch {}
  process.stdout.write(raw);
}).catch(() => process.exit(0));
