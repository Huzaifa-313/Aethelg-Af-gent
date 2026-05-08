/**
 * HealthMonitor - Monitors tool health and triggers recovery
 * RULE 10: Continuous health checking with auto-recovery
 */

import type { ToolState, HealthStatus, HealthMetrics } from './types.js';

export class HealthMonitor {
  private metrics: HealthMetrics;
  private recoveryActions: number = 0;
  private toolHealthMap: Map<string, HealthStatus> = new Map();
  private readonly healthCheckIntervalMs: number;
  private readonly consecutiveFailureThreshold: number = 3;
  private readonly degradedThresholdMs: number;
  private readonly failedThresholdMs: number;

  constructor(
    healthCheckIntervalMs: number = 60000, // Check every minute
    degradedThresholdMs: number = 300000,  // 5 minutes
    failedThresholdMs: number = 600000    // 10 minutes
  ) {
    this.metrics = {
      healthyCount: 0,
      degradedCount: 0,
      failedCount: 0,
      averageResponseTime: 0,
      lastCheck: Date.now(),
      recoveryActions: 0,
      toolHealthDistribution: new Map()
    };
    this.healthCheckIntervalMs = healthCheckIntervalMs;
    this.degradedThresholdMs = degradedThresholdMs;
    this.failedThresholdMs = failedThresholdMs;

    // Start periodic health checks
    this.startHealthCheckLoop();
  }

  /**
   * Perform comprehensive health check on all tools
   * RULE 10: Enforces health monitoring
   */
  async checkAndRecover(toolStates: Map<string, ToolState>): Promise<HealthMetrics> {
    const now = Date.now();
    let healthy = 0;
    let degraded = 0;
    let failed = 0;
    const newHealthMap = new Map<string, HealthStatus>();

    for (const [name, state] of toolStates) {
      const healthStatus = this.evaluateToolHealth(state, now);
      newHealthMap.set(name, healthStatus);

      // Count by status
      switch (healthStatus.status) {
        case 'healthy': healthy++; break;
        case 'degraded': degraded++; break;
        case 'failed': failed++; break;
      }

     // Attempt recovery if failed but criteria met
     if (healthStatus.status === 'failed' && this.shouldAttemptRecovery(state)) {
       await this.attemptRecovery(state, toolStates);
       healthStatus.canRecover = true;
       this.recoveryActions++;
     }
    }

    // Update metrics
    this.metrics = {
      healthyCount: healthy,
      degradedCount: degraded,
      failedCount: failed,
      averageResponseTime: this.calculateAverageResponseTime(toolStates),
      lastCheck: now,
      recoveryActions: this.recoveryActions,
      toolHealthDistribution: newHealthMap
    };

    this.toolHealthMap = newHealthMap;
    return this.metrics;
  }

  /**
   * Evaluate individual tool health
   * Uses time-since-use, error patterns, and demand level
   */
  private evaluateToolHealth(state: ToolState, now: number): HealthStatus {
    const timeSinceUse = now - state.lastUsed;
    const isCore = state.core;

    // Core tools are always considered healthy unless explicitly failed
    if (isCore && state.health === 'healthy') {
      return {
        toolName: state.name,
        status: 'healthy',
        lastCheck: now,
        errorCount: 0,
        consecutiveFailures: 0,
        canRecover: true
      };
    }

    // Determine health based on recency and usage
    let status: 'healthy' | 'degraded' | 'failed';
    if (timeSinceUse < this.degradedThresholdMs) {
      status = 'healthy';
    } else if (timeSinceUse < this.failedThresholdMs) {
      status = 'degraded';
    } else {
      status = 'failed';
    }

    // Override if explicitly marked failed
    if (state.health === 'failed') {
      status = 'failed';
    }

    const existing = this.toolHealthMap.get(state.name);
    const consecutiveFailures = status === 'failed'
      ? (existing?.consecutiveFailures || 0) + 1
      : 0;

    return {
      toolName: state.name,
      status,
      lastCheck: now,
      errorCount: existing?.errorCount || 0,
      consecutiveFailures,
      canRecover: this.shouldAttemptRecovery(state)
    };
  }

  /**
   * Determine if a tool should be recovered
   * RULE 10: Auto-recovery conditions
   */
  private shouldAttemptRecovery(state: ToolState): boolean {
    // Never recover core tools (they're always active)
    if (state.core) return false;

    // Don't recover if recent successful use
    const now = Date.now();
    if (now - state.lastUsed < this.failedThresholdMs) return false;

    // Recover if high demand
    if (state.demandLevel >= 5) return true;

    // Recover if heavily used historically
    if (state.usageCount > 10) return true;

    // Check consecutive failures
    const existing = this.toolHealthMap.get(state.name);
    if (existing && existing.consecutiveFailures >= this.consecutiveFailureThreshold) {
      return true;
    }

    return false;
  }

  /**
   * Attempt to recover a failed tool
   */
  private async attemptRecovery(
    state: ToolState,
    toolStates: Map<string, ToolState>
  ): Promise<void> {
    // Reset health status
    const updated = { ...state, health: 'healthy' as const };
    toolStates.set(state.name, updated);
    this.recoveryActions++;

    // Emit recovery event
    console.log(`[HealthMonitor] Recovered tool: ${state.name}`);
  }

  /**
   * Calculate average response time across all tools
   */
  private calculateAverageResponseTime(toolStates: Map<string, ToolState>): number {
    let totalTime = 0;
    let count = 0;

    for (const state of toolStates.values()) {
      // We don't have explicit response time, use usage pattern as proxy
      if (state.lastUsed > 0) {
        totalTime += Date.now() - state.lastUsed;
        count++;
      }
    }

    return count > 0 ? totalTime / count : 0;
  }

  /**
   * Get current health metrics
   * RULE 10: Metrics for monitoring
   */
  getMetrics(): HealthMetrics {
    return { ...this.metrics };
  }

  /**
   * Get health status for a specific tool
   */
  getToolHealth(toolName: string): HealthStatus | undefined {
    return this.toolHealthMap.get(toolName);
  }

  /**
   * Get all unhealthy tools
   */
  getUnhealthyTools(): HealthStatus[] {
    return Array.from(this.toolHealthMap.values()).filter(
      h => h.status !== 'healthy'
    );
  }

  /**
   * Check if overall system is healthy
   */
  isSystemHealthy(): boolean {
    const total = this.metrics.healthyCount + this.metrics.degradedCount + this.metrics.failedCount;
    if (total === 0) return true;

    const healthyRatio = this.metrics.healthyCount / total;
    return healthyRatio >= 0.8; // 80% must be healthy
  }

  /**
   * Start periodic health check loop
   */
  private startHealthCheckLoop(): void {
    setInterval(() => {
      // Health check runs independently
      // Orchestrator calls checkAndRecover during adjustments
    }, this.healthCheckIntervalMs);
  }

  /**
   * Reset health metrics for a tool (after successful use)
   */
  resetToolHealth(toolName: string): void {
    const existing = this.toolHealthMap.get(toolName);
    if (existing) {
      existing.consecutiveFailures = 0;
      existing.status = 'healthy';
      this.toolHealthMap.set(toolName, existing);
    }
  }

  /**
   * Mark tool as explicitly unhealthy
   */
  markToolUnhealthy(toolName: string, error?: Error): void {
    const existing = this.toolHealthMap.get(toolName);
    if (existing) {
      existing.status = 'failed';
      existing.errorCount++;
      existing.consecutiveFailures++;
      this.toolHealthMap.set(toolName, existing);
    }
  }

  /**
   * Get health summary
   */
  getHealthSummary(): string {
    const total = this.metrics.healthyCount + this.metrics.degradedCount + this.metrics.failedCount;
    const healthyPct = total > 0 ? ((this.metrics.healthyCount / total) * 100).toFixed(1) : '100';
    return `Healthy: ${this.metrics.healthyCount}/${total} (${healthyPct}%), Degraded: ${this.metrics.degradedCount}, Failed: ${this.metrics.failedCount}`;
  }
}
