/**
 * Skill tool: lets the model invoke skills by name via tool call.
 * Supports dynamic tool registration and schema validation.
 */

import { SkillDef, loadSkills, findSkill, substituteArguments } from './loader';
import { AgentEvent } from './executor';

/** Tool definition interface */
export interface ToolDef {
  name: string;
  schema: ToolSchema;
  func: ToolFunction;
  readOnly: boolean;
  concurrentSafe: boolean;
}

/** Tool schema interface */
export interface ToolSchema {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, { type: string; description?: string; default?: unknown }>;
    required: string[];
  };
}

/** Tool function type */
export type ToolFunction = (params: Record<string, unknown>, config: Record<string, unknown>) => Promise<string>;

/** Tool registry for dynamic registration */
export class ToolRegistry {
  private static tools: ToolDef[] = [];

  static registerTool(tool: ToolDef): void {
    this.tools.push(tool);
  }

  static getTools(): ToolDef[] {
    return this.tools;
  }

  static findTool(name: string): ToolDef | undefined {
    return this.tools.find(tool => tool.name === name);
  }
}

/** Skill tool schema */
const SKILL_SCHEMA: ToolSchema = {
  name: 'Skill',
  description: 'Invoke a named skill (reusable prompt template). Use SkillList to see available skills and their triggers.',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Skill name (e.g. \'commit\', \'review\')',
      },
      args: {
        type: 'string',
        description: 'Arguments to pass to the skill (replaces $ARGUMENTS)',
        default: '',
      },
    },
    required: ['name'],
  },
};

/** SkillList tool schema */
const SKILL_LIST_SCHEMA: ToolSchema = {
  name: 'SkillList',
  description: 'List all available skills with their names, triggers, and descriptions.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

/** Execute a skill by name and return its output */
async function skillTool(params: Record<string, unknown>, config: Record<string, unknown>): Promise<string> {
  const skillName = (params.name as string)?.trim() || '';
  const args = (params.args as string) || '';

  // Look up by name first, then by trigger
  let skill: SkillDef | null = null;
  const skills = await loadSkills();
  for (const s of skills) {
    if (s.name === skillName) {
      skill = s;
      break;
    }
  }

  if (!skill) {
    skill = findSkill(skillName);
  }

  if (!skill) {
    const names = skills.map(s => s.name).join(', ');
    return `Error: skill '${skillName}' not found. Available: ${names}`;
  }

  const rendered = substituteArguments(skill.prompt, args, skill.arguments);
  const message = `[Skill: ${skill.name}]\n\n${rendered}`;

  // Run inline via agent and collect text output
  const outputParts: string[] = [];
  const subConfig = { ...config, _depth: (config._depth as number) || 0 + 1 };

  try {
    const { runAgent } = await import('../agent/coordinator');
    const subState = {};
    for await (const event of runAgent(message, subState, subConfig, config._systemPrompt as string)) {
      if (event.type === 'TextChunk') {
        outputParts.push(event.content);
      }
    }
  } catch (error) {
    return `Skill execution error: ${error instanceof Error ? error.message : String(error)}`;
  }

  return outputParts.join('') || '(skill completed with no text output)';
}

/** List all available skills */
async function skillListTool(params: Record<string, unknown>): Promise<string> {
  const skills = await loadSkills();
  if (!skills.length) {
    return 'No skills available.';
  }
  const lines = ['Available skills:\n'];
  for (const s of skills) {
    const triggers = s.triggers.join(', ');
    const hint = s.argumentHint ? ` args: ${s.argumentHint}` : '';
    const when = s.whenToUse ? `\n when: ${s.whenToUse}` : '';
    lines.push(`- **${s.name}** [${triggers}]${hint}\n ${s.description}${when}`);
  }
  return lines.join('\n');
}

/** Register built-in tools */
export function registerBuiltinTools(): void {
  ToolRegistry.registerTool({
    name: 'Skill',
    schema: SKILL_SCHEMA,
    func: skillTool,
    readOnly: false,
    concurrentSafe: false,
  });
  ToolRegistry.registerTool({
    name: 'SkillList',
    schema: SKILL_LIST_SCHEMA,
    func: skillListTool,
    readOnly: true,
    concurrentSafe: true,
  });
}