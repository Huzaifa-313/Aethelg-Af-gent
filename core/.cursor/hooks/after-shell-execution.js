# AETHELGARD MERGED FILE
# Origin Repository: everything-claude-code-main
# Original Path: .cursor\hooks\after-shell-execution.js
# Merge Date: 2026-05-07T19:19:56.865687
# ---

#!/usr/bin/env node
const { readStdin, hookEnabled } = require('./adapter');

readStdin().then(raw => {
  try {
    const input = JSON.parse(raw || '{}');
    const cmd = String(input.command || input.args?.command || '');
    const output = String(input.output || input.result || '');

    if (hookEnabled('post:bash:pr-created', ['standard', 'strict']) && /\bgh\s+pr\s+create\b/.test(cmd)) {
      const m = output.match(/https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/\d+/);
      if (m) {
        console.error('[ECC] PR created: ' + m[0]);
        const repo = m[0].replace(/https:\/\/github\.com\/([^/]+\/[^/]+)\/pull\/\d+/, '$1');
        const pr = m[0].replace(/.+\/pull\/(\d+)/, '$1');
        console.error('[ECC] To review: gh pr review ' + pr + ' --repo ' + repo);
      }
    }

    if (hookEnabled('post:bash:build-complete', ['standard', 'strict']) && /(npm run build|pnpm build|yarn build)/.test(cmd)) {
      console.error('[ECC] Build completed');
    }
  } catch {
    // noop
  }

  process.stdout.write(raw);
}).catch(() => process.exit(0));
