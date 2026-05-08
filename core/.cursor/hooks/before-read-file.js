# AETHELGARD MERGED FILE
# Origin Repository: everything-claude-code-main
# Original Path: .cursor\hooks\before-read-file.js
# Merge Date: 2026-05-07T19:19:56.928685
# ---

#!/usr/bin/env node
const { readStdin } = require('./adapter');
readStdin().then(raw => {
  try {
    const input = JSON.parse(raw);
    const filePath = input.path || input.file || '';
    if (/\.(env|key|pem)$|\.env\.|credentials|secret/i.test(filePath)) {
      console.error('[ECC] WARNING: Reading sensitive file: ' + filePath);
      console.error('[ECC] Ensure this data is not exposed in outputs');
    }
  } catch {}
  process.stdout.write(raw);
}).catch(() => process.exit(0));
