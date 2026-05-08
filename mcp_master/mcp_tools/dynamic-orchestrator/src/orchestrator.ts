/**
 * DynamicToolOrchestrator - Main controller for Beast MCP dynamic tool management
 *
 * This orchestrator replaces static profiles with intelligent, demand-based tool management.
 * It enforces all 12 rules and integrates 5 core components:
 *   1. SemanticDetector - Analyzes intent to detect required tool groups
 *   2. PriorityPruner - Selects optimal tool set within 30-50 range
 *   3. HealthMonitor - Continuously monitors tool health and recovers failed tools
 *   4. ToolManager - Authoritative state manager for all tools
 *   5. RuleEngine - Enforces all 12 orchestration rules
 *
 * RULES ENFORCED:
 *   RULE 1:  Core protection - 30 core tools never disabled
 *   RULE 2:  Minimum 30 tools always active
 *   RULE 3:  Maximum 50 tools active
 *   RULE 4:  Scaling ON via trigger 256
 *   RULE 5:  Scaling OFF via trigger 210 (core-only)
 *   RULE 6:  Semantic detection maps intent → tool groups
 *   RULE 7:  Priority-based pruning selects optimal tools
 *   RULE 8:  Demand-based activation from usage patterns
 *   RULE 9:  Auto-disable idle/unused tools
 *   RULE 10: Health monitoring with auto-recovery
 *   RULE 11: Adjustment cooldown 5 seconds
 *   RULE 12: Usage history window 5 minutes
 */

import type {
  ToolState,
  ToolGroup,
  OrchestrationContext,
  PruningContext,
  HealthMetrics,
  DetectionResult,
  PruningDecision,
  OrchestrationConfig,
  OrchestrationState
} from './types.js';

import { SemanticDetector } from './semantic-detector.js';
import { PriorityPruner } from './priority-pruner.js';
import { HealthMonitor } from './health-monitor.js';
import { ToolManager } from './tool-manager.js';
import { RuleEngine } from './rule-engine.js';

import {
  CORE_TOOL_NAMES,
  SWITCH_TRIGGER_ENABLE,
  SWITCH_TRIGGER_DISABLE,
  MIN_ACTIVE_TOOLS,
  MAX_ACTIVE_TOOLS,
  DEFAULT_DEMAND_THRESHOLD,
  DEFAULT_ADJUSTMENT_COOLDOWN_MS,
  DEFAULT_USAGE_HISTORY_WINDOW_MS,
  DEFAULT_ADJUSTMENT_INTERVAL_MS
} from './types.js';

export class DynamicToolOrchestrator {
  // ============================================
  // COMPONENTS (5 Core Components)
  // ============================================
  private semanticDetector: SemanticDetector;
  private priorityPruner: PriorityPruner;
  private healthMonitor: HealthMonitor;
  private toolManager: ToolManager;
  private ruleEngine: RuleEngine;

  // ============================================
  // STATE
  // ============================================
  private state: OrchestrationState;
  private config: OrchestrationConfig;
  private adjustmentTimer: ReturnType<typeof setInterval> | null = null;
  private cooldownActive: boolean = false;

  constructor(config: Partial<OrchestrationConfig> = {}) {
    // Initialize components
    this.semanticDetector = new SemanticDetector();
    this.toolManager = new ToolManager(this.semanticDetector);
    this.priorityPruner = new PriorityPruner();
    this.healthMonitor = new HealthMonitor();
    this.ruleEngine = new RuleEngine();

    // Build configuration with defaults
    this.config = {
      minActiveTools: config.minActiveTools ?? MIN_ACTIVE_TOOLS,
      maxActiveTools: config.maxActiveTools ?? MAX_ACTIVE_TOOLS,
      defaultScalingTrigger: config.defaultScalingTrigger ?? SWITCH_TRIGGER_DISABLE,
      cooldownBetweenAdjustmentsMs: config.cooldownBetweenAdjustmentsMs ?? DEFAULT_ADJUSTMENT_COOLDOWN_MS,
      usageHistoryWindowMs: config.usageHistoryWindowMs ?? DEFAULT_USAGE_HISTORY_WINDOW_MS,
      demandThreshold: config.demandThreshold ?? DEFAULT_DEMAND_THRESHOLD,
      adjustmentIntervalSeconds: config.adjustmentIntervalSeconds ?? 10,
      enableLearning: config.enableLearning ?? true,
      metricsEnabled: config.metricsEnabled ?? true,
      coreProtectionEnabled: config.coreProtectionEnabled ?? true
    };

    // Initialize state
    const allToolStates = this.toolManager.getAllToolStates();
    this.state = {
      activeToolStates: allToolStates.reduce((map, tool) => {
        map.set(tool.name, tool);
        return map;
      }, new Map<string, ToolState>()),
      toolCallHistory: new Map(),
      scalingModeSwitch: this.config.defaultScalingTrigger,
      lastAdjustment: 0,
      stepHistory: [],
      systemHealth: {
        healthyCount: 0,
        degradedCount: 0,
        failedCount: 0,
        averageResponseTime: 0,
        lastCheck: Date.now(),
        recoveryActions: 0,
        toolHealthDistribution: new Map()
      },
      initialized: false
    };

    // Start adjustment loop (RULE 11: 5 second cooldown between adjustments)
    this.startAdjustmentLoop();

    this.state.initialized = true;
    console.log(`[Orchestrator] Initialized with ${this.toolManager.getEnabledCount()} core tools`);
    console.log(`[Orchestrator] Scaling mode: ${this.config.defaultScalingTrigger === 256 ? 'ON' : 'OFF'} (core-only)`);
  }

  // ============================================
  // PUBLIC API - Main Entry Points
  // ============================================

  /**
   * Execute a step with dynamic tool orchestration
   * Main entry point for task execution
   */
  async executeStep(input: string, context: Partial<OrchestrationContext> = {}): Promise<any> {
    const ctx: OrchestrationContext = {
      stepId: `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      input,
      timestamp: Date.now(),
      scalingTrigger: this.state.scalingModeSwitch as 210 | 256,
      demandThreshold: this.config.demandThreshold,
      adjustmentCooldownMs: this.config.cooldownBetweenAdjustmentsMs,
      usageHistoryWindowMs: this.config.usageHistoryWindowMs,
      ...context
    };

    console.log(`\n${'='.repeat(60)}`);
    console.log(`[Orchestrator] Step: ${ctx.stepId}`);
    console.log(`[Input] ${input}`);

    // RULE 6: Semantic Detection
    const detectionResult = this.detectRequiredTools(input);
    console.log(`[Detection] Identified ${detectionResult.toolScores.length} candidate tools (confidence: ${(detectionResult.confidence * 100).toFixed(1)}%)`);

    // RULE 8: Demand activation - activate tools based on scores
    const activatedTools = await this.activateTools(detectionResult);

    // Execute the step with current toolset
    const result = await this.executeWithTools(input, activatedTools, ctx);

    // RULE 9: Auto-disable idle tools after execution
    await this.autoDisableIdleTools();

    this.state.stepHistory.push({
      stepId: ctx.stepId,
      intent: input,
      tools: activatedTools.map(t => ({
        name: t.name,
        priority: t.priority,
        semanticTags: t.semanticTags,
        used: true,
        expectedUsage: true,
        demandScore: t.demandLevel
      })),
      context: ctx as unknown as Record<string, unknown>,
      executionPlan: this.generateExecutionPlan(input, activatedTools),
      timestamp: new Date().toISOString()
    });

    // Health check
    await this.performHealthCheck();

    this.reportStepCompletion(ctx, activatedTools, result);
    return result;
  }

  /**
   * Set scaling trigger (RULE 4 / RULE 5)
   * Trigger 256 = Enable dynamic scaling
   * Trigger 210 = Disable scaling, core-only mode
   */
  setScalingTrigger(trigger: number): boolean {
    if (trigger === SWITCH_TRIGGER_ENABLE) {
      this.state.scalingModeSwitch = SWITCH_TRIGGER_ENABLE;
      console.log('[Orchestrator] Dynamic scaling ENABLED (trigger 256)');
      this.triggerAdjustment();
      return true;
    } else if (trigger === SWITCH_TRIGGER_DISABLE) {
      this.state.scalingModeSwitch = SWITCH_TRIGGER_DISABLE;
      console.log('[Orchestrator] Dynamic scaling DISABLED (trigger 210) - reverting to core tools only');
      this.revertToCoreTools();
      return true;
    }
    return false;
  }

  /**
   * Get current status
   */
  getStatus(): {
    scalingMode: 'ON' | 'OFF' | 'UNKNOWN';
    activeCount: number;
    coreCount: number;
    totalAvailable: number;
    demandFactor: number;
    healthyCount: number;
  } {
    const allTools = this.toolManager.getAllToolStates();
    const enabledTools = this.toolManager.getEnabledTools();

    const scalingMode = this.state.scalingModeSwitch === 256 ? 'ON' :
                       this.state.scalingModeSwitch === 210 ? 'OFF' : 'UNKNOWN';

    const demandFactor = enabledTools.length / Math.max(1, allTools.length);

    return {
      scalingMode,
      activeCount: enabledTools.length,
      coreCount: this.toolManager.getCoreTools().length,
      totalAvailable: allTools.length,
      demandFactor,
      healthyCount: this.state.systemHealth.healthyCount
    };
  }

  /**
   * List active tools
   */
  listActiveTools(includeCore: boolean = true, includeOptional: boolean = true): ToolState[] {
    const all = this.toolManager.getAllToolStates();
    return all.filter(tool => {
      if (!tool.enabled) return false;
      if (!includeCore && tool.core) return false;
      if (!includeOptional && !tool.core) return false;
      return true;
    });
  }

  /**
   * List core tools (RULE 1)
   */
  listCoreTools(): string[] {
    return this.toolManager.getCoreTools();
  }

  /**
   * Register a new optional tool
   */
  registerTool(metadata: { name: string; category: string; keywords: string[]; priority: number }): boolean {
    const toolMetadata = {
      name: metadata.name,
      category: metadata.category,
      description: `Optional tool: ${metadata.name}`,
      keywords: metadata.keywords,
      isCore: false,
      priority: metadata.priority
    };
    this.toolManager.registerTool(toolMetadata);
    return true;
  }

  /**
   * Force-enable a tool (manual override) with immediate limit enforcement
   */
  forceEnable(toolName: string): boolean {
    const result = this.toolManager.forceEnable(toolName);
    if (result) {
      // Trigger immediate adjustment to enforce max limit (RULE 3)
      this.triggerImmediateAdjustment();
    }
    return result;
  }

  /**
   * Trigger immediate adjustment (bypasses cooldown for critical limit enforcement)
   */
  private triggerImmediateAdjustment(): void {
    // Skip cooldown for critical max limit enforcement
    this.adjustActiveTools();
  }

  /**
   * Force-disable a tool (manual override)
   */
  forceDisable(toolName: string): boolean {
    return this.toolManager.forceDisable(toolName);
  }

  /**
   * Record a tool call (RULE 8)
   */
  recordToolCall(toolName: string): void {
    this.toolManager.recordUsage(toolName);

    // Record in history
    if (!this.state.toolCallHistory.has(toolName)) {
      this.state.toolCallHistory.set(toolName, []);
    }
    this.state.toolCallHistory.get(toolName)!.push(Date.now());

    // Trim old history (RULE 12: 5 minute window)
    this.trimHistory();
  }

  // ============================================
  // INTERNAL - Component Integration
  // ============================================

  /**
   * RULE 6: Detect required tools from input
   */
  private detectRequiredTools(input: string): DetectionResult {
    return this.semanticDetector.analyzeInput(input);
  }

  /**
   * Activate tools based on detection scores (RULE 7-8)
   */
  private async activateTools(detection: DetectionResult): Promise<ToolState[]> {
    const activated: ToolState[] = [];
    const allToolStates = this.toolManager.getAllToolStates();

    // RULE 1: Core tools always activated
    for (const tool of allToolStates) {
      if (tool.core) {
        await this.toolManager.enableTool(tool.name);
        activated.push(tool);
      }
    }

    // Build tool scores for non-core tools
    const toolScores: Array<{
      tool: ToolState;
      score: number;
      priority: number;
      demandLevel: number;
    }> = [];

    for (const tool of allToolStates) {
      if (tool.core) continue;

      const scoreData = this.semanticDetector.calculateToolScore(
        tool.name,
        detection.conceptMatches,
        this.state.toolCallHistory,
        tool.priority
      );

      toolScores.push({
        tool,
        score: scoreData.score,
        priority: scoreData.priority,
        demandLevel: scoreData.demandLevel
      });
    }

    // RULE 7: Sort by score and select top N
    toolScores.sort((a, b) => b.score - a.score || b.priority - a.priority);

    const coreCount = activated.length;
    const maxTotal = this.config.maxActiveTools;

    let optionalSlots = maxTotal - coreCount;
    const eligibleTools = toolScores.filter(t => t.score > 0);

    // Enable top N optional tools
    for (let i = 0; i < Math.min(optionalSlots, eligibleTools.length); i++) {
      const item = eligibleTools[i];
      if (!item) break;
      const { tool } = item;
      await this.toolManager.enableTool(tool.name);
      activated.push(tool);
    }

    return activated;
  }

  /**
   * Execute with selected tools
   */
  private async executeWithTools(
    input: string,
    tools: ToolState[],
    context: OrchestrationContext
  ): Promise<any> {
    // Simulate task execution
    // In real implementation, this would delegate to appropriate MCP tools
    return {
      stepId: context.stepId,
      intent: input,
      tools: tools.map(t => ({
        name: t.name,
        priority: t.priority,
        semanticTags: t.semanticTags,
        used: true,
        expectedUsage: true,
        demandScore: t.demandLevel
      })),
      context: context as unknown as Record<string, unknown>,
      executionPlan: this.generateExecutionPlan(input, tools),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * RULE 9: Auto-disable idle tools
   */
  private async autoDisableIdleTools(): Promise<void> {
    const allTools = this.toolManager.getAllToolStates();
    const idleThreshold = 10 * 60 * 1000; // 10 minutes
    const now = Date.now();

    for (const tool of allTools) {
      if (tool.core) continue;

      if (tool.enabled) {
        const timeSinceUse = now - tool.lastUsed;
        if (timeSinceUse > idleThreshold && tool.usageCount < 3) {
          await this.toolManager.disableTool(tool.name);
          console.log(`[Orchestrator] Auto-disabled idle tool: ${tool.name}`);
        }
      }
    }
  }

  /**
   * RULE 10: Health monitoring
   */
  private async performHealthCheck(): Promise<void> {
    const toolStatesMap = this.toolManager.getAllToolStates().reduce((map, t) => {
      map.set(t.name, t);
      return map;
    }, new Map<string, ToolState>());

    const metrics = await this.healthMonitor.checkAndRecover(toolStatesMap);
    this.state.systemHealth = metrics;

    if (this.config.metricsEnabled) {
      console.log(`[Health] ${metrics.healthyCount} healthy, ${metrics.degradedCount} degraded, ${metrics.failedCount} failed`);
    }
  }

  /**
   * RULE 11: Start periodic adjustment loop
   */
  private startAdjustmentLoop(): void {
    const intervalMs = this.config.adjustmentIntervalSeconds * 1000;

    this.adjustmentTimer = setInterval(() => {
      if (this.state.scalingModeSwitch === SWITCH_TRIGGER_ENABLE) {
        this.triggerAdjustment();
      }
    }, intervalMs) as ReturnType<typeof setInterval>;

    console.log(`[Orchestrator] Adjustment loop started (every ${this.config.adjustmentIntervalSeconds}s)`);
  }

  /**
   * RULE 11: Trigger tool adjustment with cooldown
   */
  private triggerAdjustment(): void {
    if (this.cooldownActive) return;

    this.cooldownActive = true;
    setTimeout(() => {
      this.cooldownActive = false;
    }, this.config.cooldownBetweenAdjustmentsMs) as unknown as ReturnType<typeof setTimeout>;

    this.adjustActiveTools();
  }

  /**
   * Core adjustment algorithm (RULE 2, 3, 7, 8, 9)
   */
  private adjustActiveTools(): void {
    console.log(`[Orchestrator] Running tool adjustment...`);

    const allTools = this.toolManager.getAllToolStates();
    const enabledTools = allTools.filter(t => t.enabled);

    // Build pruning context
    const context: PruningContext = {
      currentActive: enabledTools.length,
      minActive: this.config.minActiveTools,
      maxActive: this.config.maxActiveTools,
      scalingTrigger: this.state.scalingModeSwitch as 210 | 256,
      demandScores: this.calculateDemandScores(),
      healthStatus: (this.healthMonitor as any)['toolHealthMap'] || new Map(),
      demandThreshold: this.config.demandThreshold
    };

    // RULE 7: Apply priority pruning
    const { decisions, finalActiveCount } = this.priorityPruner.prune(allTools, context);

    // Apply decisions
    for (const decision of decisions) {
      if (decision.action === 'enable') {
        this.toolManager.forceEnable(decision.toolName);
      } else if (decision.action === 'disable') {
        this.toolManager.forceDisable(decision.toolName);
      }
    }

    this.state.lastAdjustment = Date.now();

    console.log(`[Orchestrator] Adjustment complete: ${enabledTools.length} → ${finalActiveCount} active tools`);
    if (decisions.some(d => d.action !== 'keep')) {
      console.log('[Orchestrator] Changes:');
      for (const d of decisions.filter(d => d.action !== 'keep')) {
        console.log(`  ${d.action === 'enable' ? '+' : '-'} ${d.toolName} (${d.reason})`);
      }
    }
  }

  /**
   * Revert to core tools only (RULE 5 - trigger 210)
   */
  private revertToCoreTools(): void {
    const coreToolNames = this.toolManager.getCoreTools();
    const allTools = this.toolManager.getAllToolStates();

    for (const tool of allTools) {
      if (!tool.core && tool.enabled) {
        this.toolManager.forceDisable(tool.name);
      }
    }

    // Ensure all core tools enabled
    for (const name of coreToolNames) {
      this.toolManager.forceEnable(name);
    }

    console.log(`[Orchestrator] Reverted to ${coreToolNames.length} core tools only`);
  }

  /**
   * Calculate demand scores from usage history (RULE 12)
   */
  private calculateDemandScores(): Map<string, number> {
    const scores = new Map<string, number>();
    const now = Date.now();
    const window = this.config.usageHistoryWindowMs;

    for (const [toolName, history] of this.state.toolCallHistory) {
      const recentCalls = history.filter(t => now - t < window).length;
      scores.set(toolName, recentCalls);
    }

    return scores;
  }

  /**
   * Trim history to window (RULE 12)
   */
  private trimHistory(): void {
    const now = Date.now();
    const window = this.config.usageHistoryWindowMs;

    for (const [toolName, history] of this.state.toolCallHistory) {
      const recent = history.filter(t => now - t < window);
      this.state.toolCallHistory.set(toolName, recent);
    }
  }

  /**
   * Generate execution plan from toolset
   */
  private generateExecutionPlan(intent: string, tools: ToolState[]): string[] {
    const i = intent.toLowerCase();
    const plan: string[] = [];

    if (i.includes('search') || i.includes('find')) plan.push('search_web');
    if (i.includes('analyze')) plan.push('analyze_data');
    if (i.includes('write') || i.includes('create')) plan.push('write_output');
    if (i.includes('code') || i.includes('program')) plan.push('generate_code');
    if (i.includes('test')) plan.push('run_tests');
    if (i.includes('deploy')) plan.push('deploy');

    return plan.length > 0 ? plan : ['general_processing'];
  }

  /**
   * Report step completion
   */
  private reportStepCompletion(
    context: OrchestrationContext,
    tools: ToolState[],
    result: any
  ): void {
    const h = this.state.systemHealth;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`[STEP COMPLETE] ${context.stepId}`);
    console.log(`-`.repeat(60));
    console.log(`Intent:          ${context.input}`);
    console.log(`Active Tools:    ${tools.length} (range: ${this.config.minActiveTools}-${this.config.maxActiveTools})`);
    console.log(`Scaling Mode:    ${this.state.scalingModeSwitch === 256 ? 'ON (dynamic)' : 'OFF (core-only)'}`);
    console.log(`Core Tools:      ${this.toolManager.getCoreTools().length}`);
    console.log(`-`.repeat(60));
    console.log(`[Active Tools]`);
    for (const tool of tools.sort((a, b) => b.priority - a.priority)) {
      const marker = tool.core ? '★' : ' ';
      console.log(`  ${marker} ${tool.name.padEnd(30)} P:${tool.priority} U:${tool.usageCount} H:${tool.health}`);
    }
    console.log(`${'='.repeat(60)}\n`);
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    if (this.adjustmentTimer) {
      clearInterval(this.adjustmentTimer as any);
      this.adjustmentTimer = null;
    }
    console.log('[Orchestrator] Shutdown complete');
  }

  /**
   * Get health metrics
   */
  getHealthMetrics(): HealthMetrics {
    return { ...this.state.systemHealth };
  }

  /**
   * Get rule history
   */
  getRuleHistory(limit?: number) {
    return this.ruleEngine.getRuleHistory(limit);
  }

  /**
   * Get configuration
   */
  getConfig(): OrchestrationConfig {
    return { ...this.config };
  }
}
