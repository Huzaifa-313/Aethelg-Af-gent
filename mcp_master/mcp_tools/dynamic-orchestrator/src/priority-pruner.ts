/**
 * PriorityPruner - Applies RULEs 2-3, 7 to maintain 30-50 active tools
 * Selectively enables/disables tools based on priority, demand, and health
 */

import type { ToolState, PruningContext, PruningDecision } from './types.js';

export class PriorityPruner {
  /**
   * Core pruning algorithm - returns PruningDecision[] for each tool
   * RULE 2: Enforce minimum 30 active tools
   * RULE 3: Enforce maximum 50 active tools
   * RULE 7: Priority-based selection (higher score = keep)
   */
  prune(
    allTools: ToolState[],
    context: PruningContext
  ): { decisions: PruningDecision[]; finalActiveCount: number } {
    const decisions: PruningDecision[] = [];

    // Calculate scores for all tools
    const scoredTools = allTools.map(tool => {
      const score = this.calculateToolScore(tool, context);
      return { tool, score };
    });

    // Sort by score descending
    scoredTools.sort((a, b) => b.score - a.score);

    // RULE 2+3: Determine target count
    const coreCount = scoredTools.filter(s => s.tool.core).length;
    const optionalTools = scoredTools.filter(s => !s.tool.core);

    let targetCount = context.currentActive;

    // If too few active, add high-scoring optional tools
    if (context.currentActive < context.minActive) {
      const needed = context.minActive - context.currentActive;
      for (let i = 0; i < Math.min(needed, optionalTools.length); i++) {
        const item = optionalTools[i];
        if (item && item.score > 0) {
          targetCount++;
        }
      }
    }

    // If too many active, remove lowest scoring optional tools
    if (context.currentActive > context.maxActive) {
      const excess = context.currentActive - context.maxActive;
      targetCount = context.maxActive;
    }

    // If scaling disabled (trigger 210), revert to core only
    if (context.scalingTrigger === 210) {
      targetCount = coreCount;
    }

    // Build enable/disable list
    const finalSet = new Set<string>();
    const enabledTools: string[] = [];
    const disabledTools: string[] = [];

    // Always include all core tools (RULE 1)
    for (const { tool } of scoredTools) {
      if (tool.core) {
        finalSet.add(tool.name);
        enabledTools.push(tool.name);
        decisions.push({
          toolName: tool.name,
          action: 'keep',
          reason: 'Core tool - never disabled',
          confidence: 1.0,
          priority: tool.priority
        });
      }
    }

    // Add optional tools up to target capacity
    let slotsRemaining = targetCount - finalSet.size;
    for (const { tool, score } of scoredTools) {
      if (!tool.core && slotsRemaining > 0) {
        finalSet.add(tool.name);
        enabledTools.push(tool.name);
        decisions.push({
          toolName: tool.name,
          action: 'enable',
          reason: `Priority ${tool.priority}, demand ${score.toFixed(2)}`,
          confidence: Math.min(1, score / 10),
          priority: tool.priority
        });
        slotsRemaining--;
      }
    }

    // Disable excess optional tools
    for (const { tool } of scoredTools) {
      if (!tool.core && !finalSet.has(tool.name)) {
        finalSet.delete(tool.name);
        disabledTools.push(tool.name);
        decisions.push({
          toolName: tool.name,
          action: 'disable',
          reason: tool.health === 'failed' ? 'Health check failed' : 'Low priority, capacity exceeded',
          confidence: 0.85,
          priority: tool.priority
        });
      }
    }

    // RULE 9: Auto-disable idle tools
    const now = Date.now();
    const idleThreshold = 10 * 60 * 1000; // 10 minutes idle
    for (const { tool } of scoredTools) {
      if (!tool.core && finalSet.has(tool.name)) {
        const timeSinceUse = now - tool.lastUsed;
        if (timeSinceUse > idleThreshold && tool.usageCount < 3) {
          finalSet.delete(tool.name);
          const idx = enabledTools.indexOf(tool.name);
          if (idx > -1) enabledTools.splice(idx, 1);
          disabledTools.push(tool.name);
          decisions.push({
            toolName: tool.name,
            action: 'disable',
            reason: `Idle for ${Math.round(timeSinceUse / 60000)} minutes`,
            confidence: 0.9,
            priority: tool.priority
          });
        }
      }
    }

    return {
      decisions,
      finalActiveCount: finalSet.size
    };
  }

  /**
   * Calculate composite score for a tool (higher = more valuable to keep)
   * Combines priority, demand, recency, and health
   */
  private calculateToolScore(tool: ToolState, context: PruningContext): number {
    const now = Date.now();
    const demandScore = context.demandScores.get(tool.name) || 0;
    const healthStatus = context.healthStatus.get(tool.name);
    const healthPenalty = healthStatus?.status === 'failed' ? -100 :
                         healthStatus?.status === 'degraded' ? -50 : 0;

    // RULE 7: Priority scoring (0-10 scale)
    const priorityWeight = tool.priority / 10;

    // RULE 8: Demand-based scoring (recent usage)
    const demandWeight = Math.min(demandScore / 5, 1); // Cap at 1.0

    // Recency bonus (used recently = more valuable)
    const timeSinceUse = (now - tool.lastUsed) / 1000; // seconds
    const recencyBonus = Math.max(0, 1 - Math.min(timeSinceUse / 300, 1)); // 5min decay

    // Core bonus (always keep)
    const coreBonus = tool.core ? 2 : 0;

    // Usage count bonus (heavily used = more valuable)
    const usageBonus = Math.min(tool.usageCount / 20, 1);

    // Composite score
    const score =
      (priorityWeight * 3) +        // 0-3
      (demandWeight * 2) +          // 0-2
      (recencyBonus * 1.5) +        // 0-1.5
      (coreBonus * 2) +             // 0 or 2
      (usageBonus * 1.5);           // 0-1.5

    return score + healthPenalty;
  }

  /**
   * Enforce range constraints (RULE 2 & 3)
   * Returns tools to enable/disable to stay within [min, max]
   */
  enforceRange(
    currentActive: number,
    availableTools: ToolState[],
    min: number,
    max: number
  ): { enable: string[]; disable: string[] } {
    const toEnable: string[] = [];
    const toDisable: string[] = [];

    if (currentActive < min) {
      // Need to enable more tools - select highest priority non-enabled
      const enabledNames = new Set(availableTools.filter(t => t.enabled).map(t => t.name));
      const disabledTools = availableTools.filter(t => !t.enabled && !t.core);
      disabledTools.sort((a, b) => b.priority - a.priority);

      let needed = min - currentActive;
      for (const tool of disabledTools) {
        if (needed <= 0) break;
        toEnable.push(tool.name);
        needed--;
      }
    }

    if (currentActive > max) {
      // Need to disable some tools - select lowest priority non-core
      const enabledTools = availableTools.filter(t => t.enabled && !t.core);
      enabledTools.sort((a, b) => a.priority - b.priority || a.lastUsed - b.lastUsed);

      let excess = currentActive - max;
      for (const tool of enabledTools) {
        if (excess <= 0) break;
        toDisable.push(tool.name);
        excess--;
      }
    }

    return { enable: toEnable, disable: toDisable };
  }

  /**
   * Determine if a tool should be force-kept (rule override)
   */
  shouldForceKeep(tool: ToolState, context: PruningContext): boolean {
    // Never disable core tools (RULE 1)
    if (tool.core) return true;

    // In scaling OFF mode, only core tools active
    if (context.scalingTrigger === 210) return false;

    // High-priority tools with recent demand should stay
    if (tool.demandLevel >= 5) return true;

    // Recently used (< 2 min) stay active
    if (Date.now() - tool.lastUsed < 2 * 60 * 1000) return true;

    return false;
  }

  /**
   * Quick evaluation: should this tool be enabled?
   */
  shouldEnable(tool: ToolState, context: PruningContext): boolean {
    // RULE 1: Core tools always enabled
    if (tool.core) return true;

    // Scaling OFF (210): only core tools
    if (context.scalingTrigger === 210) return false;

    // Below minimum active count? Enable more tools
    if (context.currentActive < context.minActive) {
      return tool.priority >= 5; // Enable high-priority tools
    }

    // At or above min, use demand threshold
    return tool.demandLevel >= context.demandThreshold ||
           tool.priority >= 8 ||
           (context.currentActive < context.maxActive && tool.priority >= 5);
  }
}
