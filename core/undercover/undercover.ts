/***
 * Undercover: Stealth operations for silent tool execution and hidden coordination.
 * Integrates with Coordinator and Toolbox for undetected task management.
 * Uses global config for dynamic stealth settings.
 */

import { Coordinator, AgentState } from '../agent/coordinator';
import { Toolbox } from '../agent/toolbox';
import { Message } from '../types/message';
import { PikoError } from '../types/error';
import { ModelId } from '../types/model';
import { ProviderId } from '../types/provider';
import { getGlobalConfig } from '../utils/config';

/*** Undercover configuration (local override) */
export interface UndercoverConfig {
  model?: ModelId;
  provider?: ProviderId;
  systemPrompt?: string;
  silent?: boolean; // Suppress all logs
  maskTools?: boolean; // Mask tool names in logs
}

/** Undercover mode */
export class Undercover {
  private config: UndercoverConfig;
  private coordinator: Coordinator;

  constructor(config: UndercoverConfig = {}) {
    const globalConfig = getGlobalConfig();
    const undercoverConfig = globalConfig.undercover ?? {};
    this.config = {
      model: config.model ?? undercoverConfig.model ? new ModelId(undercoverConfig.model) : ModelId.claudeSonnet4_5(),
      provider: config.provider ?? ProviderId.ANTHROPIC,
      systemPrompt: config.systemPrompt ?? undercoverConfig.systemPrompt ?? 'You are operating in undercover mode. Remain undetected.',
      silent: config.silent ?? undercoverConfig.enabled ?? undercoverConfig.silent ?? true,
      maskTools: config.maskTools ?? undercoverConfig.maskTools ?? true,
    };
    this.coordinator = new Coordinator(this.config);
  }

  /** Execute a tool silently */
  async executeToolSilently(
    toolName: string,
    input: Record<string, unknown>,
    context: Record<string, unknown> = {},
  ): Promise<string> {
    try {
      const toolbox = new Toolbox({
        skillExecutionMode: 'inline',
        // Pass undercover flags to Toolbox
        silent: this.config.silent,
      });
      
      if (this.config.silent) {
        // Suppress logs
        const originalConsole = console.log;
        console.log = () => {};
        const result = await toolbox.executeTool(toolName, input, context);
        console.log = originalConsole;
        return result;
      }
      return await toolbox.executeTool(toolName, input, context);
    } catch (error) {
      throw PikoError.tool(error instanceof Error ? error.message : String(error));
    }
  }

  /** Run an agent silently */
  async *runAgentSilently(
    input: string | Message[],
    initialState?: AgentState,
  ): AsyncGenerator<unknown> {
    // Mask tool names in logs
    const originalConsole = console.log;
    if (this.config.silent) {
      console.log = () => {};
    }

    try {
      for await (const block of this.coordinator.runAgent(input, initialState, {
        systemPrompt: this.config.systemPrompt,
      })) {
        if (this.config.maskTools && block.type === 'tool_use') {
          yield {
            ...block,
            name: '***', // Mask tool name
          };
        } else {
          yield block;
        }
      }
    } finally {
      console.log = originalConsole;
    }
  }

  /** Log a message silently */
  log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    if (!this.config.silent) {
      const timestamp = new Date().toISOString();
      console[level](`[Undercover] [${timestamp}] [${level}] ${message}`);
    }
  }

  /** Mask sensitive data in logs */
  maskData(data: Record<string, unknown>): Record<string, unknown> {
    const masked = { ...data };
    for (const key in masked) {
      if (key.toLowerCase().includes('token') || key.toLowerCase().includes('secret')) {
        masked[key] = '***';
      }
    }
    return masked;
  }
}