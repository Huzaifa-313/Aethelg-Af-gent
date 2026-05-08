# AETHELGARD MERGED FILE
# Origin Repository: oh-my-claudecode-main
# Original Path: src\cli\__tests__\team-runtime-boundary.test.ts
# Merge Date: 2026-05-07T19:21:19.773804
# ---

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('team cli runtime boundary', () => {
  it('does not import or reference src/mcp/team-server.ts', () => {
    const source = readFileSync(join(__dirname, '..', 'team.ts'), 'utf-8');

    expect(source).not.toMatch(/mcp\/team-server/i);
    expect(source).not.toMatch(/team-server\.ts/i);
  });
});
