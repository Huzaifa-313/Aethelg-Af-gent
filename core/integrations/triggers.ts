/**
 * Trigger system for dynamic task execution.
 * Ported from thepopebot-1.2.72 for enhanced task coordination.
 */

import { Toolbox } from '../agent/toolbox';
import { PikoError } from '../types/error';

/** Trigger definition */
export interface Trigger {
  name: string;
  pattern: string | RegExp;
  handler: (body: unknown, query: Record<string, string>, headers: Record<string, string>) => Promise<void>;
}

/** Trigger registry */
export class TriggerRegistry {
  private static triggers: Trigger[] = [];

  /** Load triggers from configuration */
  static loadTriggers(): { fireTriggers: typeof TriggerRegistry.fireTriggers } {
    // In a real implementation, load from config files
    return { fireTriggers: this.fireTriggers.bind(this) };
  }

  /** Register a trigger */
  static registerTrigger(trigger: Trigger): void {
    this.triggers.push(trigger);
  }

  /** Fire matching triggers */
  static async fireTriggers(
    routePath: string,
    body: unknown,
    query: Record<string, string>,
    headers: Record<string, string>,
  ): Promise<void> {
    for (const trigger of this.triggers) {
      const pattern = trigger.pattern;
      const matches = typeof pattern === 'string'
        ? routePath === pattern
        : pattern.test(routePath);
      
      if (matches) {
        try {
          await trigger.handler(body, query, headers);
        } catch (error) {
          console.error(`Trigger '${trigger.name}' failed:`, error);
        }
      }
    }
  }

  /** Create a tool trigger */
  static createToolTrigger(
    name: string,
    pattern: string | RegExp,
    toolName: string,
    inputMapper: (body: unknown, query: Record<string, string>) => Record<string, unknown>,
  ): Trigger {
    return {
      name,
      pattern,
      async handler(body, query) {
        const input = inputMapper(body, query);
        await Toolbox.executeTool(toolName, input);
      },
    };
  }
}