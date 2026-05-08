# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: vscode-extension\openclaude-vscode\scripts\lint.js
# Merge Date: 2026-05-07T19:21:54.875304
# ---

const { readdirSync } = require('node:fs');
const { execFileSync } = require('node:child_process');
const { join } = require('node:path');

function check(dir) {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    if (f.isDirectory()) {
      check(join(dir, f.name));
    } else if (f.name.endsWith('.js') && !f.name.endsWith('.test.js')) {
      execFileSync(process.execPath, ['--check', join(dir, f.name)], {
        stdio: 'inherit',
      });
    }
  }
}

check('./src');
