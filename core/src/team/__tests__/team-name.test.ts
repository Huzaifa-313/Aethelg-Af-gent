# AETHELGARD MERGED FILE
# Origin Repository: oh-my-claudecode-main
# Original Path: src\team\__tests__\team-name.test.ts
# Merge Date: 2026-05-07T19:21:38.557308
# ---

import { describe, expect, it } from 'vitest';
import { validateTeamName } from '../team-name.js';

describe('validateTeamName', () => {
  it('accepts valid lowercase slugs (2-50 chars)', () => {
    expect(validateTeamName('ab')).toBe('ab');
    expect(validateTeamName('team-1')).toBe('team-1');
    expect(validateTeamName('a'.repeat(50))).toBe('a'.repeat(50));
  });

  it('rejects invalid team names', () => {
    expect(() => validateTeamName('a')).toThrow('Invalid team name');
    expect(() => validateTeamName('-ab')).toThrow('Invalid team name');
    expect(() => validateTeamName('ab-')).toThrow('Invalid team name');
    expect(() => validateTeamName('A-team')).toThrow('Invalid team name');
    expect(() => validateTeamName('team_name')).toThrow('Invalid team name');
    expect(() => validateTeamName('a'.repeat(51))).toThrow('Invalid team name');
  });
});
