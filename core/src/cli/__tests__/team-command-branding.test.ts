# AETHELGARD MERGED FILE
# Origin Repository: oh-my-claudecode-main
# Original Path: src\cli\__tests__\team-command-branding.test.ts
# Merge Date: 2026-05-07T19:21:19.737809
# ---

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('team command branding', () => {
  it('uses omc team wording in command surfaces', () => {
    const teamCommandSource = readFileSync(join(__dirname, '..', 'commands', 'team.ts'), 'utf-8');
    const cliIndexSource = readFileSync(join(__dirname, '..', 'index.ts'), 'utf-8');

    expect(teamCommandSource).toContain('omc team');
    expect(teamCommandSource).not.toContain('omx team');
    expect(cliIndexSource).toContain('omc team api');
    expect(cliIndexSource).not.toContain('omx team api');
  });
});
