/**
 * Unit tests for the Coordinator class.
 */

import { Coordinator, AgentState } from '../agent/coordinator';
import { Message } from '../types/message';
import { ToolRegistry } from '../tools/schema';

// Mock tool for testing
const mockTool = {
  name: 'MockTool',
  schema: {
    name: 'MockTool',
    description: 'A mock tool for testing',
    inputSchema: { type: 'object', properties: {}, required: [] },
  },
  func: async (input: Record<string, unknown>) => {
    return `MockTool output: ${JSON.stringify(input)}`;
  },
  readOnly: false,
  concurrentSafe: true,
};

// Register mock tool
ToolRegistry.registerTool(mockTool);

describe('Coordinator', () => {
  let coordinator: Coordinator;

  beforeEach(() => {
    coordinator = new Coordinator({
      systemPrompt: 'You are a test assistant.',
      tools: ['MockTool'],
    });
  });

  it('should initialize with default config', () => {
    expect(coordinator).toBeInstanceOf(Coordinator);
  });

  it('should generate text response', async () => {
    const messages = [Message.user('Hello')];
    const state: AgentState = { messages, pendingToolCalls: [], context: {} };
    
    let textBlocks = 0;
    for await (const block of coordinator.runAgent('Hello', state)) {
      if (block.type === 'text') {
        textBlocks++;
        expect(block.text).toContain('Mistral 675B');
      }
    }
    
    expect(textBlocks).toBeGreaterThan(0);
  });

  it('should execute tools dynamically', async () => {
    const messages = [Message.user('Run MockTool')];
    const state: AgentState = { messages, pendingToolCalls: [], context: {} };
    
    let toolExecuted = false;
    for await (const block of coordinator.runAgent('Run MockTool', state)) {
      if (block.type === 'tool_result' && !block.isError) {
        toolExecuted = true;
        expect(block.content).toContain('MockTool output');
      }
    }
    
    expect(toolExecuted).toBe(true);
  });

  it('should handle errors gracefully', async () => {
    const messages = [Message.user('Run MockTool')];
    const state: AgentState = { messages, pendingToolCalls: [], context: {} };
    
    // Temporarily break the tool
    const originalFunc = mockTool.func;
    mockTool.func = async () => { throw new Error('Test error'); };
    
    let errorHandled = false;
    for await (const block of coordinator.runAgent('Run MockTool', state)) {
      if (block.type === 'tool_result' && block.isError) {
        errorHandled = true;
        expect(block.content).toContain('Test error');
      }
    }
    
    // Restore the tool
    mockTool.func = originalFunc;
    expect(errorHandled).toBe(true);
  });
});