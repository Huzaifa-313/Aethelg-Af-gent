/**
 * Unit tests for the Buddy daemon.
 */

import { Buddy } from '../daemon/buddy';
import { Message } from '../types/message';

describe('Buddy', () => {
  let buddy: Buddy;

  beforeEach(() => {
    buddy = new Buddy({
      pollInterval: 10, // Short interval for testing
      maxWorkers: 2,
    });
  });

  afterEach(() => {
    buddy.stop();
  });

  it('should start and stop', () => {
    expect(buddy).toBeInstanceOf(Buddy);
    buddy.start();
    buddy.stop();
  });

  it('should add and remove tasks', () => {
    const task = {
      id: 'test-task',
      name: 'Test Task',
      schedule: '* * * * *', // Every minute
      task: async () => {},
    };
    
    buddy.addTask(task);
    expect(buddy['tasks'].length).toBe(1);
    
    buddy.removeTask('test-task');
    expect(buddy['tasks'].length).toBe(0);
  });

  it('should execute due tasks', async () => {
    let taskExecuted = false;
    const task = {
      id: 'test-task',
      name: 'Test Task',
      schedule: '* * * * *', // Every minute
      task: async () => {
        taskExecuted = true;
      },
    };
    
    buddy.addTask(task);
    buddy.start();
    
    // Wait for task execution
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(taskExecuted).toBe(true);
    
    buddy.stop();
  });

  it('should log messages', () => {
    const originalConsole = console.log;
    let consoleOutput: string[] = [];
    console.log = (message: string) => { consoleOutput.push(message); };
    
    buddy.log('Test message', 'info');
    expect(consoleOutput.length).toBeGreaterThan(0);
    expect(consoleOutput[0]).toContain('[info]');
    
    console.log = originalConsole;
  });

  it('should handle errors', async () => {
    const originalConsole = console.error;
    let consoleOutput: string[] = [];
    console.error = (message: string) => { consoleOutput.push(message); };
    
    const task = {
      id: 'error-task',
      name: 'Error Task',
      schedule: '* * * * *',
      task: async () => {
        throw new Error('Test error');
      },
    };
    
    buddy.addTask(task);
    buddy.start();
    
    // Wait for task execution
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(consoleOutput.length).toBeGreaterThan(0);
    expect(consoleOutput[0]).toContain('Test error');
    
    console.error = originalConsole;
    buddy.stop();
  });
});