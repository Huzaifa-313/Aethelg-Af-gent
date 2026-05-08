# AETHELGARD MERGED FILE
# Origin Repository: oh-my-claudecode-main
# Original Path: src\__tests__\daemon-module-path.test.ts
# Merge Date: 2026-05-07T19:21:41.843307
# ---

import { describe, it, expect } from 'vitest';
import { resolveDaemonModulePath } from '../utils/daemon-module-path.js';

describe('resolveDaemonModulePath', () => {
  it('converts TypeScript daemon module paths to .js siblings', () => {
    const result = resolveDaemonModulePath(
      '/repo/src/features/rate-limit-wait/daemon.ts',
      ['features', 'rate-limit-wait', 'daemon.js'],
    );
    expect(result).toBe('/repo/src/features/rate-limit-wait/daemon.js');
  });

  it('resolves bundled bridge/cli.cjs to dist daemon module path', () => {
    const result = resolveDaemonModulePath(
      '/repo/bridge/cli.cjs',
      ['features', 'rate-limit-wait', 'daemon.js'],
    );
    expect(result).toBe('/repo/dist/features/rate-limit-wait/daemon.js');
  });

  it('resolves bundled bridge/cli.cjs to dist reply-listener module path', () => {
    const result = resolveDaemonModulePath(
      '/repo/bridge/cli.cjs',
      ['notifications', 'reply-listener.js'],
    );
    expect(result).toBe('/repo/dist/notifications/reply-listener.js');
  });

  it('supports windows-style bundled bridge paths', () => {
    const result = resolveDaemonModulePath(
      'C:\\repo\\bridge\\cli.cjs',
      ['features', 'rate-limit-wait', 'daemon.js'],
    );
    expect(result).toBe('C:\\repo\\dist\\features\\rate-limit-wait\\daemon.js');
  });

  it('converts windows-style TypeScript daemon module paths to .js siblings', () => {
    const result = resolveDaemonModulePath(
      'C:\\repo\\src\\features\\rate-limit-wait\\daemon.ts',
      ['features', 'rate-limit-wait', 'daemon.js'],
    );
    expect(result).toBe('C:\\repo\\src\\features\\rate-limit-wait\\daemon.js');
  });

  it('does not rewrite cli.cjs outside bridge directory', () => {
    const result = resolveDaemonModulePath(
      '/repo/bin/cli.cjs',
      ['features', 'rate-limit-wait', 'daemon.js'],
    );
    expect(result).toBe('/repo/bin/cli.cjs');
  });
});
