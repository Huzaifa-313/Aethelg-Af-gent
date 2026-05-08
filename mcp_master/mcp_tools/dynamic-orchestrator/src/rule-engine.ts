/**
 * RuleEngine - Enforces all 12 orchestration rules
 * Central decision engine for tool activation/deactivation
 */

import type { ToolState, PruningContext, PruningDecision } from './types.js';

export class RuleEngine {
  private rules: Map<string, (tool: ToolState, context: PruningContext) => boolean>;
  private ruleHistory: Array<{
    timestamp: number;
    rule: string;
    tool: string;
    passed: boolean;
    reason: string;
  }> = [];

  constructor() {
    this.rules = new Map();
    this.initializeRules();
  }

  /**
   * Initialize all 12 orchestration rules
   */
  private initializeRules(): void {
    // RULE 1: Core tools never disabled (except emergency)
    this.rules.set('core_protection', (tool, ctx) => {
      if (tool.core) {
        return this.evaluateCoreProtection(tool, ctx);
      }
      return true; // Non-core tools pass this rule
    });

    // RULE 2: Minimum 30 tools active
    this.rules.set('min_tools', (tool, ctx) => {
      if (ctx.currentActive < ctx.minActive && !tool.enabled) {
        return tool.priority >= 7; // Allow high-priority tools to enable
      }
      return true;
    });

    // RULE 3: Maximum 50 tools active
    this.rules.set('max_tools', (tool, ctx) => {
      if (ctx.currentActive >= ctx.maxActive && tool.enabled && !tool.core) {
        return tool.demandLevel >= 5; // Keep only high-demand tools
      }
      return true;
    });

    // RULE 4: Scaling trigger 256 = dynamic mode ON
    this.rules.set('scaling_enable', (tool, ctx) => {
      if (ctx.scalingTrigger === 256) {
        return this.evaluateDynamicScaling(tool, ctx);
      }
      return true;
    });

    // RULE 5: Scaling trigger 210 = core tools only
    this.rules.set('scaling_disable', (tool, ctx) => {
      if (ctx.scalingTrigger === 210) {
        return tool.core; // Only core tools allowed
      }
      return true;
    });

    // RULE 6: Semantic detection validation
    this.rules.set('semantic_validation', (tool, ctx) => {
      // Tools with semantic match or high demand should be enabled
      if (tool.demandLevel > 0 || tool.semanticTags.length > 0) {
        return true;
      }
      // Low-priority tools with no demand can be disabled
      return tool.priority > 3;
    });

    // RULE 7: Priority-based pruning
    this.rules.set('priority_pruning', (tool, ctx) => {
      // High priority tools (8-10) are protected
      if (tool.priority >= 8) return true;
      // Medium priority (5-7) need demand
      if (tool.priority >= 5) return tool.demandLevel >= 2;
      // Low priority (1-4) need strong demand
      return tool.demandLevel >= 5;
    });

    // RULE 8: Demand-based activation
    this.rules.set('demand_activation', (tool, ctx) => {
      const demandThreshold = 3; // RULE 8 threshold
      if (tool.demandLevel >= demandThreshold) return true;
      // Core tools bypass demand requirement
      if (tool.core) return true;
      // Recently used tools stay active
      const recencyMs = Date.now() - tool.lastUsed;
      return recencyMs < 2 * 60 * 1000; // 2 minutes
    });

    // RULE 9: Auto-disable idle tools
    this.rules.set('auto_disable_idle', (tool, ctx) => {
      if (tool.core) return true; // Never disable core
      const idleThreshold = 10 * 60 * 1000; // 10 minutes
      const timeSinceUse = Date.now() - tool.lastUsed;
      if (timeSinceUse > idleThreshold) {
        return tool.usageCount > 5; // Keep if heavily used historically
      }
      return true;
    });

    // RULE 10: Health monitoring
    this.rules.set('health_monitoring', (tool, ctx) => {
      const health = ctx.healthStatus.get(tool.name);
      if (health?.status === 'failed') {
        return tool.demandLevel > 10; // Only keep if very high demand
      }
      return true;
    });

    // RULE 11: Adjustment cooldown (prevents thrashing)
    this.rules.set('cooldown', (tool, ctx) => {
      // This rule applies at system level, not per-tool
      return true;
    });

    // RULE 12: Usage history window (5 min)
    this.rules.set('usage_history', (tool, ctx) => {
      // Demand scores already account for 5-min window
      return true;
    });
  }

  /**
   * Evaluate all rules for a tool
   */
  evaluate(tool: ToolState, context: PruningContext): {
    passed: boolean;
    failedRules: string[];
    decision: PruningDecision;
  } {
    const failedRules: string[] = [];
    let confidence = 1.0;

    for (const [ruleName, ruleFn] of this.rules) {
      try {
        const passed = ruleFn(tool, context);
        if (!passed) {
          failedRules.push(ruleName);
          confidence -= 0.1; // Demote confidence per failed rule
        }

        // Log rule evaluation
        this.logRuleEvaluation(ruleName, tool.name, passed, context);
      } catch (error) {
        console.error(`Rule ${ruleName} evaluation error:`, error);
        failedRules.push(ruleName);
      }
    }

    const passed = failedRules.length === 0;

    // Generate decision
    let action: 'enable' | 'disable' | 'keep';
    let reason: string;

    if (passed && tool.enabled) {
      action = 'keep';
      reason = 'All rules passed';
    } else if (passed && !tool.enabled) {
      action = 'enable';
      reason = 'Meets all activation criteria';
    } else {
      action = 'disable';
      reason = `Failed rules: ${failedRules.join(', ')}`;
    }

    // Override for core tools (RULE 1 absolute)
    if (tool.core && action === 'disable') {
      action = 'keep';
      reason = 'Core tool protection (RULE 1)';
    }

    const decision: PruningDecision = {
      toolName: tool.name,
      action,
      reason,
      confidence: Math.max(0, confidence),
      priority: tool.priority
    };

    return { passed: action !== 'disable', failedRules, decision };
  }

  /**
   * Evaluate toolset against all rules (batch mode)
   */
  evaluateBatch(tools: ToolState[], context: PruningContext): PruningDecision[] {
    const decisions: PruningDecision[] = [];

    for (const tool of tools) {
      const result = this.evaluate(tool, context);
      decisions.push(result.decision);
    }

    return decisions;
  }

  /**
   * Get rule evaluation history
   */
  getRuleHistory(limit?: number): Array<{
    timestamp: number;
    rule: string;
    tool: string;
    passed: boolean;
    reason: string;
  }> {
    if (limit) {
      return this.ruleHistory.slice(-limit);
    }
    return this.ruleHistory;
  }

  /**
   * Core protection rule implementation
   */
  private evaluateCoreProtection(tool: ToolState, context: PruningContext): boolean {
    // Core tools are always allowed
    return true;
  }

  /**
   * Dynamic scaling rule implementation
   */
  private evaluateDynamicScaling(tool: ToolState, context: PruningContext): boolean {
    // In dynamic mode, enable based on demand
    if (tool.demandLevel >= context.demandThreshold) return true;
    if (tool.priority >= 8) return true; // High priority always on
    if (tool.usageCount > 0) return true; // Previously used

    // Below threshold - can be disabled
    return false;
  }

  /**
   * Log rule evaluation
   */
  private logRuleEvaluation(
    ruleName: string,
    toolName: string,
    passed: boolean,
    context: PruningContext
  ): void {
    this.ruleHistory.push({
      timestamp: Date.now(),
      rule: ruleName,
      tool: toolName,
      passed,
      reason: passed ? 'passed' : 'failed'
    });

    // Trim history
    if (this.ruleHistory.length > 10000) {
      this.ruleHistory = this.ruleHistory.slice(-5000);
    }
  }

  /**
   * Get all registered rule names
   */
  getRuleNames(): string[] {
    return Array.from(this.rules.keys());
  }

  /**
   * Check if system is ready (all critical rules passing)
   */
  isSystemReady(context: PruningContext): boolean {
    // Critical rules that must pass for system to be "ready"
    const criticalRules = ['core_protection', 'min_tools'];

    for (const rule of criticalRules) {
      const ruleFn = this.rules.get(rule);
      if (!ruleFn) return false;

      // Test with a sample tool
      const sampleTool: ToolState = {
        name: 'test',
        enabled: true,
        priority: 10,
        core: true,
        lastUsed: Date.now(),
        usageCount: 0,
        health: 'healthy',
        demandLevel: 10,
        semanticTags: [],
        activatedAt: Date.now(),
        metadata: {
          name: 'test',
          category: 'test',
          description: 'test',
          keywords: [],
          isCore: true,
          priority: 10
        }
      };

      if (!ruleFn(sampleTool, context)) return false;
    }

    return true;
  }
}
