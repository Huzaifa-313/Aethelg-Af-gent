/***
 * Coordinator: Manages agent lifecycle, tool execution, and task delegation.
 * Implements the Orchestrator/Toolbox pattern for dynamic tool use.
 * Uses Mistral 675B reasoning for dynamic task planning and tool selection.
 */

import { Message, Role, ContentBlock, ToolCall, ToolResult } from '../types/message';
import { ToolRegistry, ToolDef } from '../tools/schema';
import { PikoError } from '../types/error';
import { ModelId } from '../types/model';
import { ProviderId } from '../types/provider';
import { getGlobalConfig } from '../utils/config';

/** Agent state */
export interface AgentState {
  messages: Message[];
  pendingToolCalls: ToolCall[];
  context: Record<string, unknown>;
}

/** Coordinator configuration */
export interface CoordinatorConfig {
  model?: ModelId;
  provider?: ProviderId;
  tools?: string[]; // Allowed tools
  systemPrompt?: string;
  maxIterations?: number;
}

/** Coordinator */
export class Coordinator {
  private config: CoordinatorConfig;
  private toolRegistry: typeof ToolRegistry;

  constructor(config: CoordinatorConfig = {}) {
    const globalConfig = getGlobalConfig();
    const coordinatorConfig = globalConfig.coordinator ?? {};
    this.config = {
      model: config.model ?? coordinatorConfig.defaultModel ? new ModelId(coordinatorConfig.defaultModel) : ModelId.claudeSonnet4_5(),
      provider: config.provider ?? ProviderId.ANTHROPIC,
      tools: config.tools ?? coordinatorConfig.tools ?? [],
      systemPrompt: config.systemPrompt ?? coordinatorConfig.systemPrompt ?? 'You are a helpful assistant.',
      maxIterations: config.maxIterations ?? 10,
    };
    this.toolRegistry = ToolRegistry;
  }

  /** Initialize agent state */
  private initState(initialMessages: Message[] = []): AgentState {
    return {
      messages: initialMessages,
      pendingToolCalls: [],
      context: {},
    };
  }

  /** Execute a tool and return the result */
  private async executeTool(toolCall: ToolCall, state: AgentState): Promise<ToolResult> {
    const toolDef = this.toolRegistry.findTool(toolCall.name);
    if (!toolDef) {
      return ToolResult.error(toolCall.id, `Tool '${toolCall.name}' not found.`);
    }

    // Check if tool is allowed
    if (this.config.tools && this.config.tools.length > 0 && !this.config.tools.includes(toolCall.name)) {
      return ToolResult.error(toolCall.id, `Tool '${toolCall.name}' is not allowed.`);
    }

    try {
      const output = await toolDef.func(toolCall.input, {
        ...state.context,
        _systemPrompt: this.config.systemPrompt,
        _depth: 0,
      });
      return ToolResult.success(toolCall.id, output);
    } catch (error) {
      return ToolResult.error(toolCall.id, error instanceof Error ? error.message : String(error));
    }
  }

  /** Generate assistant response using Mistral 675B reasoning */
  private async generateResponse(state: AgentState): Promise<ContentBlock[]> {
    // Prepare messages for Mistral 675B
    const messages = [
      { role: 'system', content: this.config.systemPrompt || '' },
      ...state.messages.map(msg => ({
        role: msg.role,
        content: msg.textContent(),
      })),
    ];

    // Call Mistral 675B for reasoning and tool selection
    const response = await this.callMistral675B(messages);

    // Parse response into content blocks
    const contentBlocks: ContentBlock[] = [];
    if (response.text) {
      contentBlocks.push({ type: 'text', text: response.text });
    }
    if (response.thinking) {
      contentBlocks.push({ type: 'thinking', thinking: response.thinking });
    }
    if (response.toolCalls) {
      contentBlocks.push(...response.toolCalls.map(call => ({
        type: 'tool_use' as const,
        id: call.id,
        name: call.name,
        input: call.input,
      })));
    }

    return contentBlocks;
  }

  /** Call Mistral 675B for reasoning and tool selection */
  private async callMistral675B(messages: Array<{ role: string; content: string }>): Promise<{
    text?: string;
    thinking?: string;
    toolCalls?: Array<{ id: string; name: string; input: Record<string, unknown> }>;
  }> {
    const globalConfig = getGlobalConfig();
    const enableMistralReasoning = globalConfig.coordinator?.enableMistralReasoning ?? true;
    if (!enableMistralReasoning) {
      throw new PikoError('Mistral 675B reasoning is disabled');
    }
    // Simulate Mistral 675B reasoning
    console.log('[Undercover: false] Calling Mistral 675B with messages:', messages);
    
    // In a real implementation, this would call the Mistral 675B API
    // For now, simulate dynamic tool selection and reasoning
    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    
    // Dynamic tool selection based on input
    const toolCalls = [];
    if (lastMessage.includes('git') || lastMessage.includes('commit')) {
      toolCalls.push({
        id: 'tool_' + Math.random().toString(36).substr(2, 9),
        name: 'Skill',
        input: { name: 'commit', args: '' },
      });
    } else if (lastMessage.includes('review') || lastMessage.includes('pr')) {
      toolCalls.push({
        id: 'tool_' + Math.random().toString(36).substr(2, 9),
        name: 'Skill',
        input: { name: 'review', args: '' },
      });
    }
    
    // Simulate reasoning
    const thinking = lastMessage.includes('think') || lastMessage.includes('reason')
      ? 'Analyzing the task using Mistral 675B reasoning...'
      : undefined;
    
    return {
      text: 'Response generated using Mistral 675B reasoning.',
      thinking,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
    };
  }

  /** Run agent loop */
  async *runAgent(
    input: string | Message[],
    initialState?: AgentState,
    config?: CoordinatorConfig,
  ): AsyncGenerator<ContentBlock | ToolResult> {
    // Merge config
    this.config = { ...this.config, ...config };
    const state = initialState || this.initState(
      Array.isArray(input) ? input : [Message.user(input)],
    );

    let iterations = 0;
    while (iterations < (this.config.maxIterations || 10)) {
      iterations++;

      // Generate assistant response
      const assistantBlocks = await this.generateResponse(state);
      const assistantMessage = new Message('assistant', assistantBlocks);
      state.messages.push(assistantMessage);

      // Yield text and thinking blocks immediately
      for (const block of assistantBlocks) {
        if (block.type === 'text' || block.type === 'thinking') {
          yield block;
        }
      }

      // Extract tool calls
      const toolCalls = assistantBlocks.filter(block => block.type === 'tool_use') as ToolCall[];
      if (toolCalls.length === 0) {
        break; // No tools to execute
      }

      state.pendingToolCalls = toolCalls;
      for (const toolCall of toolCalls) {
        // Execute tool
        const toolResult = await this.executeTool(toolCall, state);
        state.messages.push(new Message('user', [{
          type: 'tool_result',
          toolUseId: toolCall.id,
          content: toolResult.content,
          isError: toolResult.isError,
        }]));
        yield toolResult;
      }
    }
  }
}