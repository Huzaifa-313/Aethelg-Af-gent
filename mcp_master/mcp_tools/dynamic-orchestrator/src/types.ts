/**
 * Type definitions for the Dynamic Tool Orchestrator
 * Enforces all 12 rules through type safety
 */

// ============================================
// RULE 1-4: Core Tool Types (30 core tools, always enabled)
// ============================================

export interface ToolMetadata {
  name: string;
  category: string;
  description: string;
  keywords: string[];
  isCore: boolean;
  priority: number; // 1-10, higher = more critical
  maxInstances?: number;
  dependencies?: string[];
  cooldownMs?: number;
}

export interface ToolState {
  name: string;
  enabled: boolean;
  priority: number;
  core: boolean;
  lastUsed: number;
  usageCount: number;
  health: 'healthy' | 'degraded' | 'failed';
  demandLevel: number;
  semanticTags: string[];
  activatedAt: number;
  metadata: ToolMetadata;
}

export interface ToolGroup {
  name: string;
  priority: number; // 1-10
  triggerKeywords: string[];
  autoEnable: boolean;
  minCount?: number;   // RULE: min tools per group
  maxCount?: number;   // RULE: max tools per group
  alwaysOn?: boolean;
  tools: string[];
}

// ============================================
// RULE 5-6: Demand & Priority Types
// ============================================

export interface DemandSignal {
  type: 'tool_called' | 'task_started' | 'idle_detected';
  toolName?: string;
  timestamp: number;
  category?: string;
  keywords?: string[];
  confidence?: number; // 0-1
}

export interface ToolPriority {
  name: string;
  baseScore: number;
  demandMultiplier: number;
  recencyWeight: number;
  coreBonus: number;
}

// ============================================
// RULE 7-8: Pruning & Health Types
// ============================================

export interface PruningContext {
  currentActive: number;
  minActive: number;   // RULE: 30 minimum
  maxActive: number;   // RULE: 50 maximum
  scalingTrigger: 210 | 256; // RULE: trigger state
  demandScores: Map<string, number>;
  healthStatus: Map<string, HealthStatus>;
  demandThreshold: number; // RULE 8: threshold (default 3)
}

export interface PruningDecision {
  toolName: string;
  action: 'enable' | 'disable' | 'keep';
  reason: string;
  confidence: number;
  priority: number;
}

export interface HealthStatus {
  toolName: string;
  status: 'healthy' | 'degraded' | 'failed';
  lastCheck: number;
  responseTimeMs?: number;
  errorCount: number;
  consecutiveFailures: number;
  canRecover: boolean;
}

export interface HealthMetrics {
  healthyCount: number;
  degradedCount: number;
  failedCount: number;
  averageResponseTime: number;
  lastCheck: number;
  recoveryActions: number;
  toolHealthDistribution: Map<string, HealthStatus>;
}

// ============================================
// RULE 9-10: Orchestration Context
// ============================================

export interface OrchestrationContext {
  stepId: string;
  input: string;
  timestamp: number;
  scalingTrigger: 210 | 256;
  demandThreshold: number;  // RULE: default 3
  adjustmentCooldownMs: number; // RULE: 5000ms
  usageHistoryWindowMs: number;  // RULE: 5 minutes
}

export interface ExecutionPlan {
  stepId: string;
  intent: string;
  tools: Array<{
    name: string;
    priority: number;
    semanticTags: string[];
    expectedUsage: boolean;
    demandScore: number;
  }>;
  context: Record<string, unknown>;
  executionPlan: string[];
  timestamp: string;
}

// ============================================
// RULE 11-12: Semantic & Detection Types
// ============================================

export interface SemanticConcept {
  name: string;
  weight: number;
  relatedTools: string[];
}

export interface DetectionResult {
  matchedGroups: ToolGroup[];
  conceptMatches: Map<string, number>;
  toolScores: Array<{
    name: string;
    score: number;
    priority: number;
    demandLevel: number;
    semanticMatch: boolean;
  }>;
  confidence: number;
}

export interface SemanticProfile {
  profileId: string;
  name: string;
  description: string;
  triggerKeywords: string[];
  semanticConcepts: SemanticConcept[];
  minTools: number;
  maxTools: number;
  alwaysEnabledTools: string[];
}

// ============================================
// Configuration & State Types
// ============================================

export interface OrchestrationConfig {
  minActiveTools: number;     // RULE: 30
  maxActiveTools: number;     // RULE: 50
  defaultScalingTrigger: 210 | 256;
  cooldownBetweenAdjustmentsMs: number;  // RULE: 5000
  usageHistoryWindowMs: number;           // RULE: 300000 (5 min)
  demandThreshold: number;                // RULE: 3 calls
  adjustmentIntervalSeconds: number;      // RULE: 10
  enableLearning: boolean;
  metricsEnabled: boolean;
  coreProtectionEnabled: boolean;         // RULE: never disable core
}

export interface OrchestrationState {
  activeToolStates: Map<string, ToolState>;
  toolCallHistory: Map<string, number[]>; // timestamp[]
  scalingModeSwitch: number; // 210 or 256
  lastAdjustment: number;
  stepHistory: ExecutionPlan[];
  systemHealth: HealthMetrics;
  initialized: boolean;
}

export interface OrchestrationDecision {
  timestamp: number;
  action: 'enable' | 'disable' | 'keep';
  toolName: string;
  reason: string;
  triggeredBy: 'demand' | 'health' | 'manual' | 'rule';
  confidence: number;
  context: Record<string, unknown>;
}

// ============================================
// Export all core consts (12 RULES)
// ============================================

export const CORE_TOOL_NAMES = [
  'sequential-thinking', 'memory', 'filesystem',
  'read', 'write', 'edit', 'create', 'delete',
  'bash', 'shell', 'execute', 'run',
  'git-status', 'git-diff', 'git-commit', 'git-push', 'git-pull',
  'grep', 'glob', 'search', 'list', 'find',
  'test', 'jest', 'mocha', 'vitest',
  'npm', 'install', 'build', 'compile'
] as const;

export const SWITCH_TRIGGER_ENABLE = 256 as const;
export const SWITCH_TRIGGER_DISABLE = 210 as const;
export const MIN_ACTIVE_TOOLS = 30;
export const MAX_ACTIVE_TOOLS = 50;
export const DEFAULT_DEMAND_THRESHOLD = 3;
export const DEFAULT_ADJUSTMENT_COOLDOWN_MS = 5000;
export const DEFAULT_USAGE_HISTORY_WINDOW_MS = 300000; // 5 minutes
export const DEFAULT_ADJUSTMENT_INTERVAL_MS = 10000; // 10 seconds

export const ORCHESTRATION_RULES = {
  RULE_1_CORE_PROTECTION: 'core_tools_never_disabled',
  RULE_2_MIN_TOOLS: 'enforce_min_30_tools',
  RULE_3_MAX_TOOLS: 'enforce_max_50_tools',
  RULE_4_SCALING_ENABLE: 'scaling_trigger_256',
  RULE_5_SCALING_DISABLE: 'scaling_trigger_210',
  RULE_6_SEMANTIC_DETECTION: 'semantic_group_detection',
  RULE_7_PRIORITY_PRUNING: 'priority_based_pruning',
  RULE_8_DEMAND_ACTIVATION: 'demand_based_activation',
  RULE_9_AUTO_DISABLE: 'auto_disable_idle',
  RULE_10_HEALTH_MONITORING: 'health_check_recovery',
  RULE_11_ADJUSTMENT_COOLDOWN: 'cooldown_5_seconds',
  RULE_12_USAGE_HISTORY: 'history_window_5_minutes'
} as const;

export type CoreToolName = (typeof CORE_TOOL_NAMES)[number];
export type SwitchTrigger = typeof SWITCH_TRIGGER_ENABLE | typeof SWITCH_TRIGGER_DISABLE;
