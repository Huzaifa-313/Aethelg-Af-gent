/***
 * Toolbox: Dynamic tool registration, discovery, and execution.
 * Extends the ToolRegistry with runtime tool management and config support.
 */

import { ToolRegistry, ToolDef, ToolFunction } from '../tools/schema';
import { PikoError } from '../types/error';
import { getGlobalConfig } from '../utils/config';

/*** Toolbox configuration */
export interface ToolboxConfig {
  dynamicToolRegistration?: boolean;
  maxRegisteredTools?: number;
  skillExecutionMode?: 'inline' | 'forked';
}

/** Toolbox */
export class Toolbox {
  private config: ToolboxConfig;

  constructor(config: ToolboxConfig = {}) {
    const globalConfig = getGlobalConfig();
    const toolboxConfig = globalConfig.toolbox ?? {};
    this.config = {
      dynamicToolRegistration: config.dynamicToolRegistration ?? toolboxConfig.dynamicToolRegistration ?? true,
      maxRegisteredTools: config.maxRegisteredTools ?? toolboxConfig.maxRegisteredTools ?? 100,
      skillExecutionMode: config.skillExecutionMode ?? toolboxConfig.skillExecutionMode ?? 'inline',
    };
  }
  /** Register a tool */
  registerTool(tool: ToolDef): void {
    if (!this.config.dynamicToolRegistration) {
      throw PikoError.tool('Dynamic tool registration is disabled');
    }
    const tools = ToolRegistry.getTools();
    if (tools.length >= (this.config.maxRegisteredTools ?? 100)) {
      throw PikoError.tool(`Max registered tools (${this.config.maxRegisteredTools}) reached`);
    }
    ToolRegistry.registerTool(tool);
  }

  /** Register multiple tools */
  registerTools(tools: ToolDef[]): void {
    tools.forEach(tool => this.registerTool(tool));
  }

  /** Find a tool by name */
  findTool(name: string): ToolDef | undefined {
    return ToolRegistry.findTool(name);
  }

  /** List all registered tools */
  listTools(): ToolDef[] {
    return ToolRegistry.getTools();
  }

  /** Execute a tool by name */
  async executeTool(
    name: string,
    input: Record<string, unknown>,
    context: Record<string, unknown> = {},
  ): Promise<string> {
    const tool = this.findTool(name);
    if (!tool) {
      throw PikoError.tool(`Tool '${name}' not found.`);
    }

    try {
      // Respect execution mode (inline/forked)
      if (this.config.skillExecutionMode === 'forked') {
        console.log('[Undercover: false] Executing tool in forked mode:', name);
        // In a real implementation, this would spawn a subprocess
        return await tool.func(input, context);
      } else {
        console.log('[Undercover: false] Executing tool in inline mode:', name);
        return await tool.func(input, context);
      }
    } catch (error) {
      throw PikoError.tool(error instanceof Error ? error.message : String(error));
    }
  }

  /** Create a tool from a function */
  createTool(
    name: string,
    description: string,
    inputSchema: ToolDef['schema']['inputSchema'],
    func: ToolFunction,
    options: {
      readOnly?: boolean;
      concurrentSafe?: boolean;
    } = {},
  ): ToolDef {
    return {
      name,
      schema: {
        name,
        description,
        inputSchema,
      },
      func,
      readOnly: options.readOnly ?? false,
      concurrentSafe: options.concurrentSafe ?? false,
    };
  }
}