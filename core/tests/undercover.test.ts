/**
 * Unit tests for the Undercover class.
 */

import { Undercover } from '../undercover/undercover';
import { Toolbox } from '../agent/toolbox';
import { Message } from '../types/message';

// Mock tool for testing
const mockTool = {
  name: 'SilentTool',
  schema: {
    name: 'SilentTool',
    description: 'A silent tool for testing',
    inputSchema: { type: 'object', properties: {}, required: [] },
  },
  func: async (input: Record<string, unknown>) => {
    return `SilentTool output: ${JSON.stringify(input)}`;
  },
  readOnly: false,
  concurrentSafe: true,
};

// Register mock tool
Toolbox.registerTool(mockTool);

describe('Undercover', () => {
  let undercover: Undercover;

  beforeEach(() => {
    undercover = new Undercover({
      silent: true,
      maskTools: true,
    });
  });

  it('should execute tools silently', async () => {
    const originalConsole = console.log;
    let consoleOutput: string[] = [];
    console.log = (message: string) => { consoleOutput.push(message); };
    
    const output = await undercover.executeToolSilently('SilentTool', { test: 'input' });
    expect(output).toContain('SilentTool output');
    expect(consoleOutput.length).toBe(0); // No logs
    
    console.log = originalConsole;
  });

  it('should mask tool names in agent output', async () => {
    const messages = [Message.user('Run SilentTool')];
    let maskedToolFound = false;
    
    for await (const block of undercover.runAgentSilently(messages)) {
      if (typeof block === 'object' && 'type' in block && block.type === 'tool_use') {
        maskedToolFound = true;
        expect(block.name).toBe('***'); // Masked
      }
    }
    
    expect(maskedToolFound).toBe(true);
  });

  it('should log messages when not silent', () => {
    const nonSilentUndercover = new Undercover({ silent: false });
    const originalConsole = console.log;
    let consoleOutput: string[] = [];
    console.log = (message: string) => { consoleOutput.push(message); };
    
    nonSilentUndercover.log('Test message');
    expect(consoleOutput.length).toBeGreaterThan(0);
    expect(consoleOutput[0]).toContain('[Undercover]');
    
    console.log = originalConsole;
  });

  it('should mask sensitive data', () => {
    const data = {
      apiKey: 'secret123',
      token: 'abcxyz',
      normalField: 'value',
    };
    
    const masked = undercover.maskData(data);
    expect(masked.apiKey).toBe('***');
    expect(masked.token).toBe('***');
    expect(masked.normalField).toBe('value');
  });
});