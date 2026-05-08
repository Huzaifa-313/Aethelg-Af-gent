# AETHELGARD MERGED FILE
# Origin Repository: oh-my-claudecode-main
# Original Path: src\hooks\persistent-mode\__tests__\deleted-state-writeback.test.ts
# Merge Date: 2026-05-07T19:21:25.482722
# ---

import { describe, it, expect } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { shouldWriteStateBack } from '../index.js';

describe('persistent-mode deleted state writeback guard (issue #2085)', () => {
  it('respects external deletion before stop-hook writeback', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'persistent-writeback-'));
    const statePath = join(tempDir, 'ralph-state.json');

    try {
      writeFileSync(statePath, JSON.stringify({ active: true }));
      expect(shouldWriteStateBack(statePath)).toBe(true);

      unlinkSync(statePath);
      expect(shouldWriteStateBack(statePath)).toBe(false);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
