/**
 * Skill execution: inline (current conversation) or forked (sub-agent).
 * Supports async generator-based event streaming for tool/agent coordination.
 */

import { SkillDef } from './loader';
import { substituteArguments } from './loader';

/** Agent event types for tool/skill coordination */
export type AgentEvent =
  | { type: 'TextChunk'; content: string }
  | { type: 'ToolStart'; name: string; input: unknown }
  | { type: 'ToolEnd'; name: string; output: unknown }
  | { type: 'TurnDone' }
  | { type: 'Error'; error: Error };

/** Agent state interface */
export interface AgentState {
  // Add state properties as needed (e.g., conversation history)
}

/** Execute a skill */
export async function* executeSkill(
  skill: SkillDef,
  args: string,
  state: AgentState,
  config: Record<string, unknown>,
  systemPrompt: string,
): AsyncGenerator<AgentEvent> {
  const rendered = substituteArguments(skill.prompt, args, skill.arguments);
  const message = `[Skill: ${skill.name}]\n\n${rendered}`;

  if (skill.context === 'fork') {
    yield* _executeForked(skill, message, config, systemPrompt);
  } else {
    yield* _executeInline(message, state, config, systemPrompt);
  }
}

/** Run skill prompt inline in the current conversation */
async function* _executeInline(
  message: string,
  state: AgentState,
  config: Record<string, unknown>,
  systemPrompt: string,
): AsyncGenerator<AgentEvent> {
  // Import agent dynamically to avoid circular dependencies
  const { runAgent } = await import('../agent/coordinator');
  yield* runAgent(message, state, config, systemPrompt);
}

/** Run skill as an isolated sub-agent (separate conversation context) */
async function* _executeForked(
  skill: SkillDef,
  message: string,
  config: Record<string, unknown>,
  systemPrompt: string,
): AsyncGenerator<AgentEvent> {
  // Import agent dynamically to avoid circular dependencies
  const { runAgent } = await import('../agent/coordinator');

  // Build a sub-agent config with depth tracking
  const depth = (config._depth as number) || 0;
  const subConfig: Record<string, unknown> = {
    ...config,
    _depth: depth + 1,
    _systemPrompt: systemPrompt,
  };

  // Override model if skill specifies one
  if (skill.model) {
    subConfig.model = skill.model;
  }

  // Restrict tools if skill specifies allowed-tools
  if (skill.tools) {
    subConfig._allowedTools = skill.tools;
  }

  // Run in fresh state (no shared history)
  const subState: AgentState = {};
  yield* runAgent(message, subState, subConfig, systemPrompt);
}