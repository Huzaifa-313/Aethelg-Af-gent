# AETHELGARD MERGED FILE
# Origin Repository: everything-claude-code-main
# Original Path: .cursor\hooks\after-tab-file-edit.js
# Merge Date: 2026-05-07T19:19:56.890686
# ---

#!/usr/bin/env node
const { readStdin, runExistingHook, transformToClaude } = require('./adapter');
readStdin().then(raw => {
  try {
    const input = JSON.parse(raw);
    const claudeInput = transformToClaude(input, {
      tool_input: { file_path: input.path || input.file || '' }
    });
    runExistingHook('post-edit-format.js', JSON.stringify(claudeInput));
  } catch {}
  process.stdout.write(raw);
}).catch(() => process.exit(0));
