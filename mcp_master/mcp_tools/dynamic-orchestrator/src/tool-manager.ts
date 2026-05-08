/**
 * ToolManager - Central state manager for all tools
 * RULE 1: Maintains authoritative tool state
 */

import type { ToolState, ToolMetadata } from './types.js';
import { CORE_TOOL_NAMES, type CoreToolName } from './types.js';

export class ToolManager {
  private toolStates: Map<string, ToolState>;
  private readonly coreTools: Set<string>;
  private enabledTools: Set<string>;
  private semanticDetector: any; // Will be injected

  constructor(semanticDetector?: any) {
    this.toolStates = new Map();
    this.coreTools = new Set(CORE_TOOL_NAMES);
    this.enabledTools = new Set();
    this.semanticDetector = semanticDetector;
    this.initializeCoreTools();
  }

  /**
   * Initialize all 30 core tools as always enabled
   * RULE 1: Core tools are always active
   */
  private initializeCoreTools(): void {
    for (const toolName of CORE_TOOL_NAMES) {
      const state: ToolState = {
        name: toolName,
        enabled: true,
        priority: 10,
        core: true,
        lastUsed: Date.now(),
        usageCount: 0,
        health: 'healthy',
        demandLevel: 0,
        semanticTags: this.semanticDetector?.getToolsForConcept('core_foundation') || [],
        activatedAt: Date.now(),
        metadata: {
          name: toolName,
          category: this.inferCategory(toolName),
          description: `Core tool: ${toolName}`,
          keywords: [toolName],
          isCore: true,
          priority: 10
        }
      };
      this.toolStates.set(toolName, state);
      this.enabledTools.add(toolName);
    }
  }

  /**
   * Register a new tool (non-core, optional)
   */
  registerTool(metadata: ToolMetadata): void {
    if (this.toolStates.has(metadata.name)) {
      console.warn(`Tool already registered: ${metadata.name}`);
      return;
    }

    const state: ToolState = {
      name: metadata.name,
      enabled: false, // Start disabled
      priority: metadata.priority,
      core: metadata.isCore,
      lastUsed: 0,
      usageCount: 0,
      health: 'healthy',
      demandLevel: 0,
      semanticTags: this.extractSemanticTags(metadata),
      activatedAt: 0,
      metadata
    };

    this.toolStates.set(metadata.name, state);

    // If core, immediately enable
    if (metadata.isCore) {
      this.enableTool(metadata.name);
    }
  }

  /**
   * Enable a tool (RULE 1: core tools cannot be disabled)
   */
  async enableTool(toolName: string): Promise<boolean> {
    const state = this.toolStates.get(toolName);
    if (!state) {
      console.error(`Tool not found: ${toolName}`);
      return false;
    }

    // Core tools are always enabled
    if (state.core) {
      state.enabled = true;
      this.enabledTools.add(toolName);
      return true;
    }

    state.enabled = true;
    state.activatedAt = Date.now();
    state.lastUsed = Date.now();
    this.enabledTools.add(toolName);

    return true;
  }

  /**
   * Disable a tool (RULE 1: prevents disabling core tools)
   */
  async disableTool(toolName: string, force: boolean = false): Promise<boolean> {
    const state = this.toolStates.get(toolName);
    if (!state) return false;

    // RULE 1: Never disable core tools unless forced (emergency only)
    if (state.core && !force) {
      console.warn(`[ToolManager] Cannot disable core tool: ${toolName}`);
      return false;
    }

    state.enabled = false;
    this.enabledTools.delete(toolName);
    return true;
  }

  /**
   * Force-enable a tool (manual override)
   */
  forceEnable(toolName: string): boolean {
    const state = this.toolStates.get(toolName);
    if (!state) return false;

    state.enabled = true;
    state.lastUsed = Date.now();
    state.demandLevel = Math.max(state.demandLevel, 10); // Boost demand
    this.enabledTools.add(toolName);
    console.log(`[ToolManager] Force-enabled: ${toolName}`);
    return true;
  }

  /**
   * Force-disable a tool (manual override)
   */
  forceDisable(toolName: string): boolean {
    const state = this.toolStates.get(toolName);
    if (!state) return false;

    // Even with force, core tools resist disable (safety)
    if (state.core) {
      console.warn(`[ToolManager] Refusing to force-disable core tool: ${toolName}`);
      return false;
    }

    state.enabled = false;
    this.enabledTools.delete(toolName);
    console.log(`[ToolManager] Force-disabled: ${toolName}`);
    return true;
  }

  /**
   * Record tool usage (RULE 8: demand tracking)
   */
  recordUsage(toolName: string): void {
    const state = this.toolStates.get(toolName);
    if (!state) return;

    state.lastUsed = Date.now();
    state.usageCount++;

    // Increase demand level
    state.demandLevel = Math.min(state.demandLevel + 1, 100);

    // Emit event for orchestrator
    this.emit('tool:used', { toolName, timestamp: Date.now() });
  }

  /**
   * Get all tool states
   */
  getAllToolStates(): ToolState[] {
    return Array.from(this.toolStates.values());
  }

  /**
   * Get enabled tools
   */
  getEnabledTools(): string[] {
    return Array.from(this.enabledTools);
  }

  /**
   * Get tool by name
   */
  getTool(name: string): ToolState | undefined {
    return this.toolStates.get(name);
  }

  /**
   * Get core tools
   */
  getCoreTools(): string[] {
    return Array.from(this.coreTools);
  }

  /**
   * Get enabled count
   */
  getEnabledCount(): number {
    return this.enabledTools.size;
  }

  /**
   * Check if tool is enabled
   */
  isEnabled(name: string): boolean {
    return this.enabledTools.has(name);
  }

  /**
   * Update tool metadata
   */
  updateToolMetadata(name: string, metadata: Partial<ToolMetadata>): void {
    const state = this.toolStates.get(name);
    if (state) {
      state.metadata = { ...state.metadata, ...metadata };
      this.toolStates.set(name, state);
    }
  }

  /**
   * Reset demand levels (periodic cleanup)
   */
  resetDemandLevels(): void {
    const now = Date.now();
    const recentWindow = 5 * 60 * 1000; // 5 min

    for (const [name, state] of this.toolStates) {
      const timeSinceUse = now - state.lastUsed;
      if (timeSinceUse > recentWindow) {
        state.demandLevel = Math.max(0, state.demandLevel - 1);
      }
    }
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    total: number;
    enabled: number;
    core: number;
    optional: number;
    totalUsage: number;
    avgUsage: number;
  } {
    const total = this.toolStates.size;
    const enabled = this.enabledTools.size;
    const core = Array.from(this.toolStates.values()).filter(t => t.core).length;
    const optional = total - core;
    const totalUsage = Array.from(this.toolStates.values()).reduce((sum, t) => sum + t.usageCount, 0);
    const avgUsage = total > 0 ? totalUsage / total : 0;

    return { total, enabled, core, optional, totalUsage, avgUsage };
  }

  /**
   * Simple event emitter (lightweight)
   */
  private listeners: Map<string, Array<(data: unknown) => void>> = new Map();

  on(event: string, callback: (data: unknown) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: string, data: unknown): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      for (const cb of callbacks) cb(data);
    }
  }

  /**
   * Helper: infer category from tool name
   */
  private inferCategory(toolName: string): string {
    if (['bash', 'shell', 'execute', 'run'].includes(toolName)) return 'execution';
    if (['git-status', 'git-diff', 'git-commit', 'git-push', 'git-pull', 'git', 'github'].includes(toolName)) return 'git';
    if (['grep', 'glob', 'search', 'find'].includes(toolName)) return 'search';
    if (['test', 'jest', 'mocha', 'vitest'].includes(toolName)) return 'testing';
    if (['npm', 'install', 'build', 'compile'].includes(toolName)) return 'package';
    if (['read', 'write', 'edit', 'create', 'delete', 'filesystem'].includes(toolName)) return 'filesystem';
    if (['memory', 'sequential-thinking'].includes(toolName)) return 'reasoning';
    return 'utility';
  }

  /**
   * Helper: extract semantic tags from metadata
   */
  private extractSemanticTags(metadata: ToolMetadata): string[] {
    const tags: string[] = [metadata.category];
    tags.push(...metadata.keywords);
    return [...new Set(tags)];
  }
}
