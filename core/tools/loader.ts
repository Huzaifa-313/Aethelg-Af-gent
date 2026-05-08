/**
 * Skill loading: parse markdown files with YAML frontmatter into SkillDef objects.
 * Supports project-level, user-level, and built-in skills.
 */

import * as fs from 'fs';
import * as path from 'path';

/** Skill definition interface */
export interface SkillDef {
  name: string;
  description: string;
  triggers: string[]; // ["/commit", "commit changes"]
  tools: string[]; // ["Bash", "Read"] (allowed-tools)
  prompt: string; // full prompt body after frontmatter
  filePath: string; // Path to the skill file
  whenToUse: string; // when Claude should auto-invoke this skill
  argumentHint: string; // e.g. "[branch] [description]"
  arguments: string[]; // named arg names
  model: string; // model override
  userInvocable: boolean; // appears in /skills list
  context: 'inline' | 'fork'; // "inline" or "fork" (fork = sub-agent)
  source: 'user' | 'project' | 'builtin'; // "user", "project", "builtin"
}

/** Directory paths for skill discovery */
function getSkillPaths(): string[] {
  return [
    path.join(process.cwd(), '.clawspring', 'skills'), // project-level (priority)
    path.join(process.env.HOME || '', '.clawspring', 'skills'), // user-level
  ];
}

/** Parse YAML-like list: `[a, b, c]` or `"a, b,