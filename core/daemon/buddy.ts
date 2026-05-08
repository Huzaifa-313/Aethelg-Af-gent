/***
 * Buddy: Background daemon for logging, monitoring, and periodic tasks.
 * Runs as a persistent process to manage long-running operations.
 * Uses global config for dynamic task scheduling and logging.
 */

import { Coordinator, AgentState } from '../agent/coordinator';
import { Toolbox } from '../agent/toolbox';
import { Message } from '../types/message';
import { PikoError } from '../types/error';
import { ModelId } from '../types/model';
import { ProviderId } from '../types/provider';
import { getGlobalConfig } from '../utils/config';

/*** Buddy configuration (local override) */
export interface BuddyConfig {
  model?: ModelId;
  provider?: ProviderId;
  systemPrompt?: string;
  pollInterval?: number; // ms
  maxWorkers?: number;
}

/** Background task */
export interface BackgroundTask {
  id: string;
  name: string;
  schedule: string; // cron expression
  task: () => Promise<void>;
  lastRun?: Date;
  nextRun?: Date;
}

/** Buddy daemon */
export class Buddy {
  private config: BuddyConfig;
  private coordinator: Coordinator;
  private tasks: BackgroundTask[];
  private activeWorkers: number;
  private running: boolean;

  constructor(config: BuddyConfig = {}) {
    const globalConfig = getGlobalConfig();
    const buddyConfig = globalConfig.buddy ?? {};
    this.config = {
      model: config.model ?? buddyConfig.model ? new ModelId(buddyConfig.model) : ModelId.claudeSonnet4_5(),
      provider: config.provider ?? ProviderId.ANTHROPIC,
      systemPrompt: config.systemPrompt ?? buddyConfig.systemPrompt ?? 'You are Buddy, a background daemon for managing tasks.',
      pollInterval: config.pollInterval ?? buddyConfig.monitorIntervalMs ?? 60000,
      maxWorkers: config.maxWorkers ?? 4,
    };
    this.coordinator = new Coordinator(this.config);
    this.tasks = [];
    this.activeWorkers = 0;
    this.running = false;
  }

  /** Start the daemon */
  start(): void {
    if (this.running) return;
    this.running = true;
    this.runLoop().catch(error => {
      console.error('Buddy daemon error:', error);
    });
  }

  /** Stop the daemon */
  stop(): void {
    this.running = false;
  }

  /** Add a background task */
  addTask(task: BackgroundTask): void {
    this.tasks.push(task);
  }

  /** Remove a background task */
  removeTask(taskId: string): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }

  /** Run the daemon loop */
  private async runLoop(): Promise<void> {
    while (this.running) {
      const now = new Date();

      // Execute due tasks
      for (const task of this.tasks) {
        if (this.activeWorkers >= (this.config.maxWorkers || 4)) break;
        if (task.nextRun && task.nextRun <= now) {
          this.activeWorkers++;
          task.lastRun = now;
          task.nextRun = this.calculateNextRun(task.schedule);

          // Run task in background
          task.task().finally(() => {
            this.activeWorkers--;
          });
        }
      }

      // Poll interval
      await new Promise(resolve =>
        setTimeout(resolve, this.config.pollInterval || 5000),
      );
    }
  }

  /** Calculate next run time from cron expression */
  private calculateNextRun(cron: string): Date {
    // Simplified cron parser (use a library like `cron-parser` in production)
    const parts = cron.split(' ');
    if (parts.length !== 5) {
      throw PikoError.config(`Invalid cron expression: ${cron}`);
    }

    const now = new Date();
    const next = new Date(now);
    next.setMinutes(now.getMinutes() + 1); // Default: run every minute
    return next;
  }

  /** Log a message */
  log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const globalConfig = getGlobalConfig();
    const undercoverConfig = globalConfig.undercover ?? {};
    const silentLogging = undercoverConfig.stealthLogging ?? undercoverConfig.silent ?? false;
    
    if (silentLogging) {
      // Suppress logs in stealth mode
      return;
    }
    
    const timestamp = new Date().toISOString();
    const logMessage = `[Buddy] [${timestamp}] [${level}] ${message}`;
    console[level](logMessage);

    // Optionally send to a logging service
    if (level === 'error') {
      this.handleError(logMessage).catch(console.error);
    }
  }

  /** Handle errors */
  private async handleError(error: string): Promise<void> {
    const state: AgentState = {
      messages: [Message.user(`Error encountered: ${error}`)],
      pendingToolCalls: [],
      context: {},
    };

    // Use coordinator to handle error
    for await (const block of this.coordinator.runAgent(
      `Handle this error: ${error}`,
      state,
      { systemPrompt: this.config.systemPrompt },
    )) {
      if (block.type === 'text') {
        this.log(`Error handler response: ${block.text}`, 'info');
      }
    }
  }

  /** Monitor system health */
  async monitorHealth(): Promise<void> {
    const state: AgentState = {
      messages: [Message.user('Check system health and report any issues.')],
      pendingToolCalls: [],
      context: {},
    };

    // Use coordinator to monitor health
    for await (const block of this.coordinator.runAgent(
      'Check system health',
      state,
      { systemPrompt: this.config.systemPrompt },
    )) {
      if (block.type === 'text') {
        this.log(`Health check: ${block.text}`, 'info');
      }
    }
  }
}