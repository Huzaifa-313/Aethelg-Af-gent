# AETHELGARD MERGED FILE
# Origin Repository: oh-my-claudecode-main
# Original Path: src\team\__tests__\index.compat-exports.test.ts
# Merge Date: 2026-05-07T19:21:37.539307
# ---

import { describe, expect, it } from 'vitest';
import {
  shouldLoadShellRc,
  validateCliBinaryPath,
  resolveCliBinaryPath,
  clearResolvedPathCache,
  LayoutStabilizer,
} from '../index.js';

describe('team index backward-compat exports', () => {
  it('re-exports legacy CLI path helpers', () => {
    expect(typeof shouldLoadShellRc).toBe('function');
    expect(typeof validateCliBinaryPath).toBe('function');
    expect(typeof resolveCliBinaryPath).toBe('function');
    expect(typeof clearResolvedPathCache).toBe('function');
  });

  it('re-exports LayoutStabilizer runtime symbol', () => {
    const instance = new LayoutStabilizer({
      sessionTarget: 'test:0',
      leaderPaneId: '%1',
      debounceMs: 1,
    });
    expect(instance).toBeInstanceOf(LayoutStabilizer);
    instance.dispose();
  });
});
