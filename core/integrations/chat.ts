/**
 * AI chat integration for enhanced reasoning and task coordination.
 * Ported from thepopebot-1.2.72 for Mistral 675B integration.
 */

import { Coordinator } from '../agent/coordinator';
import { Undercover } from '../undercover/undercover';
import { Message } from '../types/message';
import { PikoError } from '../types/error';

/** Chat options */
export interface ChatOptions {
  threadId?: string;
  userId?: string;
  chatTitle?: string;
  undercover?: boolean;
}

/** AI chat integration */
export class AIChat {
  private coordinator: Coordinator;
  private undercover: Undercover;

  constructor() {
    this.coordinator = new Coordinator({
      systemPrompt: 'You are a helpful assistant integrated with dynamic tools and triggers.',
    });
    this.undercover = new Undercover();
  }

  /** Chat with the AI */
  async chat(
    threadId: string,
    text: string,
    attachments: unknown[] = [],
    options: ChatOptions = {},
  ): Promise<string> {
    const messages: Message[] = [
      Message.user(`User: ${text}\nAttachments: ${JSON.stringify(attachments)}`),
    ];

    try {
      if (options.undercover) {
        // Run in undercover mode
        for await (const block of this.undercover.runAgentSilently(messages)) {
          if (block.type === 'text') {
            return block.text;
          }
        }
        return 'Undercover operation completed.';
      } else {
        // Run in normal mode
        for await (const block of this.coordinator.runAgent(messages)) {
          if (block.type === 'text') {
            return block.text;
          }
        }
        return 'Task completed.';
      }
    } catch (error) {
      throw PikoError.tool(error instanceof Error ? error.message : String(error));
    }
  }

  /** Summarize job results */
  async summarizeJob(results: Record<string, unknown>): Promise<string> {
    const messages: Message[] = [
      Message.user(`Summarize these job results: ${JSON.stringify(results)}`),
    ];

    try {
      for await (const block of this.coordinator.runAgent(messages)) {
        if (block.type === 'text') {
          return block.text;
        }
      }
      return 'Job summary generated.';
    } catch (error) {
      throw PikoError.tool(error instanceof Error ? error.message : String(error));
    }
  }
}