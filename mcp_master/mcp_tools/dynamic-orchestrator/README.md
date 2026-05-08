# Beast MCP Dynamic Orchestrator

## Overview

The Dynamic Orchestrator replaces static tool profiles with intelligent, demand-based tool management. It automatically scales between 30-50 active tools based on actual usage patterns while ensuring core tools are always available.

## Architecture

```
DynamicToolOrchestrator (main controller)
│
├── SemanticDetector     - Analyzes user intent to identify tool groups
├── PriorityPruner       - Selects optimal tools within 30-50 range
├── HealthMonitor        - Monitors tool health with auto-recovery
├── ToolManager          - Authoritative state manager
└── RuleEngine           - Enforces all 12 orchestration rules
```

## The 12 Rules

| Rule | Description | Enforcement |
|------|-------------|-------------|
| RULE 1 | Core protection - 30 core tools never disabled | RuleEngine + ToolManager |
| RULE 2 | Minimum 30 tools always active | PriorityPruner |
| RULE 3 | Maximum 50 tools active | PriorityPruner |
| RULE 4 | Scaling ON via trigger 256 | Orchestrator.setScalingTrigger() |
| RULE 5 | Scaling OFF via trigger 210 (core-only) | Orchestrator.setScalingTrigger() |
| RULE 6 | Semantic detection maps intent → tool groups | SemanticDetector |
| RULE 7 | Priority-based tool selection | PriorityPruner.calculateToolScore() |
| RULE 8 | Demand-based activation from usage patterns | ToolManager.recordUsage() |
| RULE 9 | Auto-disable idle tools (10min threshold) | PriorityPruner + Orchestrator |
| RULE 10 | Health monitoring + auto-recovery | HealthMonitor |
| RULE 11 | Adjustment cooldown 5 seconds | Orchestrator.startAdjustmentLoop() |
| RULE 12 | Usage history window 5 minutes | ToolManager.trimHistory() |

## Quick Start

### Installation

```bash
cd beast-mcp/tools/dynamic-orchestrator
npm install
npm run build
```

### Basic Usage

```typescript
import { DynamicToolOrchestrator, createDynamicOrchestrator } from './src/index.js';

// Create orchestrator with default config (30 core tools, scale to 50)
const orchestrator = createDynamicOrchestrator();

// Execute a step - orchestrator automatically manages tools
const result = await orchestrator.executeStep('I need to create a git repository and commit my changes');

console.log('Active tools:', result.tools.map(t => t.name));
```

### Controlling Scaling Mode

```typescript
// Enable dynamic scaling (trigger 256) - tools activate based on demand
orchestrator.setScalingTrigger(256);

// Disable scaling (trigger 210) - revert to core tools only (30)
orchestrator.setScalingTrigger(210);

// Check status
const status = orchestrator.getStatus();
console.log(`${status.activeCount}/${status.totalAvailable} active (${status.scalingMode})`);
```

## Component Deep Dive

### 1. SemanticDetector

Analyzes user intent and matches it to semantic tool groups.

```typescript
const detector = new SemanticDetector();
const detection = detector.analyzeInput('I need to search the web and commit to git');

// Returns matched groups with scores
console.log(detection.matchedGroups);  // [{ name: 'web_network', priority: 8 }, { name: 'version_control', priority: 8 }]
console.log(detection.confidence);     // 0.85
```

**21 Semantic Groups:**
- `core_foundation` (always on)
- `execution`, `version_control`, `code_search`
- `testing`, `package_management`, `build_compile`
- `web_network`, `browser_automation`, `database`
- `ai_agents`, `vector_search`, `data_transform`
- `security`, `system_utils`, `utilities`
- `cloud_devops`, `monitoring`, `knowledge_docs`

### 2. PriorityPruner

Selects optimal tool subset within min/max bounds.

```typescript
import { PriorityPruner } from './src/index.js';

const pruner = new PriorityPruner();
const decisions = pruner.prune(allTools, {
  currentActive: 45,
  minActive: 30,
  maxActive: 50,
  scalingTrigger: 256,
  demandScores: demandMap,
  healthStatus: healthMap
});

console.log(decisions.decisions); // Array of enable/disable decisions
console.log(decisions.finalActiveCount); // 47
```

**Scoring Factors:**
- Priority (weight: 0.3)
- Demand level (weight: 0.2)
- Recency (weight: 0.15)
- Core bonus (+2.0)
- Usage count (weight: 0.15)
- Health penalty (-100 if failed)

### 3. HealthMonitor

Continuously monitors tool health.

```typescript
const monitor = new HealthMonitor();

// Check and recover failed tools
const metrics = await monitor.checkAndRecover(toolStatesMap);
console.log(metrics.healthyCount);     // 48
console.log(metrics.degradedCount);    // 2
console.log(metrics.failedCount);      // 0
console.log(metrics.recoveryActions);  // 1

// Get health summary
console.log(monitor.getHealthSummary()); // "Healthy: 48/50 (96%), Degraded: 2, Failed: 0"
```

**Health States:**
- `healthy` - Used recently (< 5 min)
- `degraded` - Used 5-10 min ago
- `failed` - Not used for 10+ min or explicit failure

Auto-recovery triggers when:
- Demand level ≥ 5, OR
- Historical usage > 10, OR
- Consecutive failures ≥ 3

### 4. ToolManager

Authoritative state manager for all tools.

```typescript
const manager = new ToolManager();

// Register custom tool
manager.registerTool({
  name: 'my-custom-tool',
  category: 'utility',
  description: 'My custom tool',
  keywords: ['custom', 'special'],
  isCore: false,
  priority: 5
});

// Record usage (triggers demand calculation)
manager.recordUsage('git-commit');

// Force override
manager.forceEnable('tavily');
manager.forceDisable('some-optional-tool');

// Get statistics
const stats = manager.getStatistics();
console.log(`Total: ${stats.total}, Enabled: ${stats.enabled}, Core: ${stats.core}`);
```

### 5. RuleEngine

Enforces all 12 orchestration rules.

```typescript
const engine = new RuleEngine();
const result = engine.evaluate(toolState, pruningContext);

console.log(result.passed);          // false
console.log(result.failedRules);     // ['max_tools', 'health_monitoring']
console.log(result.decision);        // { action: 'disable', reason: '...', confidence: 0.65 }
```

**12 Rules Implemented:**
1. `core_protection` - Core tools never disabled
2. `min_tools` - Enforces ≥30 active
3. `max_tools` - Enforces ≤50 active
4. `scaling_enable` - Dynamic mode logic
5. `scaling_disable` - Core-only mode logic
6. `semantic_validation` - Semantic matching validity
7. `priority_pruning` - Priority-based selection
8. `demand_activation` - Demand threshold check
9. `auto_disable_idle` - Idle tool removal
10. `health_monitoring` - Health-based filtering
11. `cooldown` - Adjustment cooldown enforcement
12. `usage_history` - History window validation

## Configuration

```typescript
const orchestrator = new DynamicToolOrchestrator({
  minActiveTools: 30,           // RULE 2
  maxActiveTools: 50,           // RULE 3
  defaultScalingTrigger: 256,   // 256=ON, 210=OFF
  demandThreshold: 3,           // RULE 8: calls to consider active
  adjustmentIntervalSeconds: 10, // Seconds between adjustments
  cooldownBetweenAdjustmentsMs: 5000, // RULE 11: 5s cooldown
  usageHistoryWindowMs: 300000, // RULE 12: 5min window
  enableLearning: true,
  metricsEnabled: true
});
```

## Advanced Usage

### Manual Tool Control

```typescript
// Check which tools would be selected
const detection = orchestrator['detectRequiredTools']('search web and commit to git');
console.log(detection.matchedGroups.map(g => g.name));

// List all active tools
const active = orchestrator.listActiveTools();
console.log(active.map(t => t.name));

// Get core tools (never auto-disabled)
const core = orchestrator.listCoreTools();
console.log(core);
```

### Accessing Components Directly

```typescript
// Semantic detector
const detector = orchestrator['semanticDetector'];
const concepts = detector.getSemanticConcepts();

// Priority pruner
const pruner = orchestrator['priorityPruner'];

// Health monitor
const monitor = orchestrator['healthMonitor'];
const metrics = monitor.getMetrics();

// Rule engine
const engine = orchestrator['ruleEngine'];
const history = engine.getRuleHistory(100);
```

### Event Monitoring

```typescript
orchestrator['toolManager'].on('tool:used', (data) => {
  console.log(`Tool used: ${data.toolName}`);
});

orchestrator['toolManager'].on('tool:enabled', (data) => {
  console.log(`Tool enabled: ${data.toolName}`);
});
```

## Rule Enforcement Details

### RULE 1: Core Protection

Core tools (30) are hardcoded and never auto-disabled:

```typescript
const CORE_TOOLS = [
  'sequential-thinking', 'memory', 'filesystem',
  'read', 'write', 'edit', 'create', 'delete',
  'bash', 'shell', 'execute', 'run',
  'git-status', 'git-diff', 'git-commit', 'git-push', 'git-pull',
  'grep', 'glob', 'search', 'list', 'find',
  'test', 'jest', 'mocha', 'vitest',
  'npm', 'install', 'build', 'compile',
  'env', 'config', 'settings', 'path',
  'date', 'calculate', 'format', 'filter',
  'log', 'debug'
];
```

### RULE 2-3: Min/Max Enforcement

The PriorityPruner guarantees:
- If active < 30, enables high-priority optional tools
- If active > 50, disables lowest-scoring optional tools
- Core tools are always counted (never removed)

### RULE 4-5: Switch Triggers

```typescript
// Trigger 256 = Dynamic scaling ON
orchestrator.setScalingTrigger(256);
// → Tools auto-activate based on demand every 10s

// Trigger 210 = Scaling OFF (core-only)
orchestrator.setScalingTrigger(210);
// → Immediately disables all optional tools
```

### RULE 6: Semantic Detection

Uses 21 semantic groups with keyword matching:

```
Input: "I need to search the web"
→ Matches: web_network (priority 8)
→ Enables: fetch, tavily, brave-search
```

### RULE 7: Priority Pruning

Score = (priority_weight × priority) + (demand_score × demand_weight) + recency_bonus + core_bonus

Tools ranked by score, top N selected within min/max bounds.

### RULE 8: Demand Activation

Demand calculated from usage in last 5 minutes:
- 0 calls = 0 demand
- 3+ calls = threshold met
- Core tools have infinite demand

### RULE 9: Auto-Disable Idle

Tools idle >10min with <3 uses are candidates for disable.

### RULE 10: Health Monitoring

```typescript
// Health states based on recency:
// healthy:   last used < 5min
// degraded:  5min ≤ last used < 10min
// failed:    last used ≥ 10min

// Auto-recovery when:
// - demandLevel ≥ 5, OR
// - usageCount > 10, OR
// - consecutive failures ≥ 3
```

### RULE 11: Cooldown

Adjustments blocked if last adjustment < 5 seconds ago.

### RULE 12: History Window

Usage history retains only last 5 minutes (rolled continuously).

## Metrics & Monitoring

```typescript
// Get system status
const status = orchestrator.getStatus();
// { scalingMode: 'ON', activeCount: 42, coreCount: 30, totalAvailable: 50, demandFactor: 0.84 }

// Get health metrics
const health = orchestrator.getHealthMetrics();
// { healthyCount: 48, degradedCount: 2, failedCount: 0, recoveryActions: 5, ... }

// Get rule evaluation history
const history = orchestrator.getRuleHistory(100);

// Get tool manager statistics
const stats = orchestrator['toolManager'].getStatistics();
// { total: 50, enabled: 42, core: 30, optional: 20, totalUsage: 1520, avgUsage: 30.4 }
```

## Integration with Beast MCP

The orchestrator integrates with the MCP server as a tool provider:

```typescript
import { createToolRegistry } from '@claude-flow/mcp';
import { DynamicToolOrchestrator } from './src/index.js';

const toolRegistry = createToolRegistry();
const orchestrator = new DynamicToolOrchestrator();

// Register orchestration tools as MCP tools
// (See DynamicToolControlTools.ts in ruflo for reference)

// Tools exposed:
// - tool_switch_scaling(trigger: 256|210)
// - tool_status() → current state
// - tool_list_active() → active tools
// - tool_list_core() → core tools
// - tool_force_enable(name)
// - tool_force_disable(name)
// - tool_scaling_stats(timeWindowMs?)
```

## Testing

```bash
# Build
npm run build

# Run interactive demo
node dist/orchestrator.js --interactive

# Single message test
node dist/orchestrator.js --message "I need to commit code and push to GitHub"

# Health check
node dist/orchestrator.js --health

# Status
node dist/orchestrator.js --status
```

## Performance

- Tool activation: <10ms per tool
- Adjustment cycle: 10 seconds
- Cooldown: 5 seconds
- O(1) tool lookup via Map-based state
- Memory: ~2MB per 50 tools tracked

## Troubleshooting

### Scaling not activating?

1. Check current trigger: `orchestrator.getStatus().scalingMode`
2. If 'OFF', enable: `orchestrator.setScalingTrigger(256)`
3. Verify config: `orchestrator.getConfig()`

### Core tool being disabled?

Core tools are never auto-disabled. If a core tool is missing:
- It may not be in `CORE_TOOL_NAMES` list
- Manually re-enable: `orchestrator.forceEnable('tool-name')`

### Too many/few tools active?

Adjust `minActiveTools` / `maxActiveTools` in config, or change `demandThreshold`.

## License

MIT
