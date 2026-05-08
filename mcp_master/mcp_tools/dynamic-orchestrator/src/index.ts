/**
 * Dynamic Tool Orchestrator - Main Entry Point
 *
 * The orchestrator replaces static profiles with intelligent, demand-based
 * tool management for Beast MCP. It enforces all 12 orchestration rules.
 *
 * Architecture:
 *   DynamicToolOrchestrator (main controller)
 *   ├── SemanticDetector     - Intent analysis and tool matching
 *   ├── PriorityPruner       - Tool selection within 30-50 range
 *   ├── HealthMonitor        - Health checks and recovery
 *   ├── ToolManager          - State persistence and mutation
 *   └── RuleEngine           - 12-rule enforcement
 *
 * Usage:
 *   import { DynamicToolOrchestrator } from '@beast-mcp/tools-dynamic-orchestrator';
 *   const orchestrator = new DynamicToolOrchestrator();
 *   await orchestrator.executeStep('I need to git commit and push to GitHub');
 *
 * Rules Enforced:
 *   1.  Core Protection - 30 core tools never disabled
 *   2.  Min 30 Tools - Always maintain ≥30 active tools
 *   3.  Max 50 Tools - Never exceed 50 active tools
 *   4.  Scaling ON - Trigger 256 enables dynamic scaling
 *   5.  Scaling OFF - Trigger 210 reverts to core-only
 *   6.  Semantic Detection - Maps intent to tool groups
 *   7.  Priority Pruning - Selects optimal tools by score
 *   8.  Demand Activation - Tools activate on usage patterns
 *   9.  Auto-Disable Idle - Removes unused tools after 10min
 *   10. Health Monitoring - Continuous health checks + recovery
 *   11. Adjustment Cooldown - 5 sec between adjustments
 *   12. Usage History Window - 5 min retention for demand calc
 */

// Main orchestrator
export { DynamicToolOrchestrator } from './orchestrator.js';

// 5 Core Components
export { SemanticDetector } from './semantic-detector.js';
export { PriorityPruner } from './priority-pruner.js';
export { HealthMonitor } from './health-monitor.js';
export { ToolManager } from './tool-manager.js';
export { RuleEngine } from './rule-engine.js';

// Types
export type {
  ToolState,
  ToolGroup,
  ToolMetadata,
  DemandSignal,
  ToolPriority,
  PruningContext,
  PruningDecision,
  HealthStatus,
  HealthMetrics,
  OrchestrationContext,
  ExecutionPlan,
  SemanticConcept,
  DetectionResult,
  SemanticProfile,
  OrchestrationConfig,
  OrchestrationState,
  OrchestrationDecision
} from './types.js';

// Constants (12 Rules)
export {
  CORE_TOOL_NAMES,
  SWITCH_TRIGGER_ENABLE,
  SWITCH_TRIGGER_DISABLE,
  MIN_ACTIVE_TOOLS,
  MAX_ACTIVE_TOOLS,
  DEFAULT_DEMAND_THRESHOLD,
  DEFAULT_ADJUSTMENT_COOLDOWN_MS,
  DEFAULT_USAGE_HISTORY_WINDOW_MS,
  DEFAULT_ADJUSTMENT_INTERVAL_MS,
  ORCHESTRATION_RULES,
  type CoreToolName,
  type SwitchTrigger
} from './types.js';

// Convenience factory
import { DynamicToolOrchestrator } from './orchestrator.js';
import type { OrchestrationConfig } from './types.js';

export function createDynamicOrchestrator(config?: Partial<OrchestrationConfig>): DynamicToolOrchestrator {
  return new DynamicToolOrchestrator(config);
}
