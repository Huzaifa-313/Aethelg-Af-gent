/**
 * Unit tests for the Toolbox class.
 */

import { Toolbox } from '../agent/toolbox';
import { PikoError } from '../types/error';

// Mock tool for testing
const mockTool = {
  name: 'TestTool',
  schema: {
    name: 'TestTool',
    description: 'A test tool',
    inputSchema: { type: 'object', properties: {}, required: [] },
  },
  func: async (input: Record<string, unknown>) => {
    return `TestTool output: ${JSON.stringify(input)}`;
  },
  readOnly: false,
  concurrentSafe: true,
};

describe('Toolbox', () => {
  beforeEach(() => {
    // Reset tools before each test
    Toolbox.registerTool(mockTool);
  });

  it('should register and find tools', () => {
    const tool = Toolbox.findTool('TestTool');
    expect(tool).toBeDefined();
    expect(tool?.name).toBe('TestTool');
  });

  it('should execute tools', async () => {
    const output = await Toolbox.executeTool('TestTool', { test: 'input' });
    expect(output).toContain('TestTool output');
    expect(output).toContain('test');
    expect(output).toContain('input');
  });

  it('should throw error for unknown tools', async () => {
    await expect(Toolbox.executeTool('UnknownTool', {})).rejects.toThrow(PikoError);
  });

  it('should handle tool execution errors', async () => {
    // Temporarily break the tool
    const originalFunc = mockTool.func;
    mockTool.func = async () => { throw new Error('Test error'); };
    
    await expect(Toolbox.executeTool('TestTool', {})).rejects.toThrow(PikoError);
    
    // Restore the tool
    mockTool.func = originalFunc;
  });

  it('should list all registered tools', () => {
    const tools = Toolbox.listTools();
    expect(tools.length).toBeGreaterThan(0);
    expect(tools.some(tool => tool.name === 'TestTool')).toBe(true);
  });
});