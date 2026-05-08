#!/usr/bin/env node
/**
 * Example: Dynamic Orchestrator Usage
 * Demonstrates all 5 components and 12 rules in action
 */

import {
  DynamicToolOrchestrator,
  createDynamicOrchestrator,
  SemanticDetector,
  PriorityPruner,
  HealthMonitor,
  ToolManager,
  RuleEngine,
  CORE_TOOL_NAMES,
  SWITCH_TRIGGER_ENABLE,
  SWITCH_TRIGGER_DISABLE
} from './src/index.js';

async function example1_basicOrchestration() {
  console.log('=== Example 1: Basic Orchestration ===\n');

  const orch = createDynamicOrchestrator();

  // Execute a task - orchestrator auto-manages tools
  const result = await orch.executeStep('I need to create a new file and write some JavaScript code');

  console.log(`Used ${result.tools.length} tools:`);
  for (const tool of result.tools) {
    console.log(`  - ${tool.name} (priority: ${tool.priority})`);
  }
}

async function example2_scalingModes() {
  console.log('\n=== Example 2: Scaling Modes (Rule 4-5) ===\n');

  const orch = createDynamicOrchestrator();

  // Mode 1: Core only (trigger 210)
  orch.setScalingTrigger(SWITCH_TRIGGER_DISABLE);
  let status = orch.getStatus();
  console.log(`OFF mode: ${status.activeCount} active (should be ${status.coreCount} core)`);

  // Mode 2: Dynamic scaling (trigger 256)
  orch.setScalingTrigger(SWITCH_TRIGGER_ENABLE);
  status = orch.getStatus();
  console.log(`ON mode: ${status.activeCount} active (scales to demand)`);

  // Execute a task to see tools activate
  await orch.executeStep('Search the web for documentation and run tests');
  status = orch.getStatus();
  console.log(`After task: ${status.activeCount} active tools`);
}

async function example3_semanticDetection() {
  console.log('\n=== Example 3: Semantic Detection (Rule 6) ===\n');

  const detector = new SemanticDetector();

  const inputs = [
    'Git commit and push to GitHub',
    'Search for API documentation',
    'Run unit tests and build',
    'Create a React component',
    'Deploy to Kubernetes'
  ];

  for (const input of inputs) {
    const detection = detector.analyzeInput(input);
    const matched = detection.matchedGroups
      .filter(g => g.name !== 'core_foundation')
      .map(g => `${g.name}(${Math.round(g.priority)})`)
      .join(', ');
    console.log(`"${input.substring(0, 40)}" → [${matched}]`);
  }
}

async function example4_priorityPruning() {
  console.log('\n=== Example 4: Priority Pruner (Rule 7) ===\n');

  const pruner = new PriorityPruner();

  // Simulate tool states with varying priority and demand
  const tools = [
    { name: 'bash', priority: 9, core: true, demandLevel: 5, health: 'healthy' as const, enabled: true, lastUsed: Date.now(), usageCount: 10 },
    { name: 'git-commit', priority: 8, core: false, demandLevel: 8, health: 'healthy' as const, enabled: true, lastUsed: Date.now(), usageCount: 20 },
    { name: 'tavily', priority: 7, core: false, demandLevel: 2, health: 'healthy' as const, enabled: true, lastUsed: Date.now() - 10000000, usageCount: 5 },
    { name: 'puppeteer', priority: 8, core: false, demandLevel: 0, health: 'degraded' as const, enabled: true, lastUsed: Date.now() - 600000, usageCount: 2 },
    { name: 'docker', priority: 5, core: false, demandLevel: 0, health: 'healthy' as const, enabled: false, lastUsed: 0, usageCount: 0 }
  ] as any as ToolManager['getAllToolStates']();

  const context = {
    currentActive: 5,
    minActive: 30,
    maxActive: 50,
    scalingTrigger: 256 as const,
    demandScores: new Map([['git-commit', 8], ['bash', 5]]),
    healthStatus: new Map(),
    demandThreshold: 3
  };

  const { decisions, finalActiveCount } = pruner.prune(tools, context);

  console.log('Pruning decisions:');
  for (const d of decisions) {
    const icon = d.action === 'enable' ? '➕' : d.action === 'disable' ? '➖' : '✓';
    console.log(`  ${icon} ${d.toolName}: ${d.reason}`);
  }
  console.log(`Final active count: ${finalActiveCount}`);
}

async function example5_healthMonitoring() {
  console.log('\n=== Example 5: Health Monitor (Rule 10) ===\n');

  const monitor = new HealthMonitor();

  // Simulate some tool states
  const toolStates = new Map<string, any>();
  toolStates.set('bash', {
    name: 'bash',
    core: true,
    lastUsed: Date.now(),
    health: 'healthy',
    demandLevel: 5,
    usageCount: 10
  });
  toolStates.set('tavily', {
    name: 'tavily',
    core: false,
    lastUsed: Date.now() - 700000, // 11+ min ago
    health: 'healthy',
    demandLevel: 0,
    usageCount: 2
  });

  const metrics = await monitor.checkAndRecover(toolStates);
  console.log(`Health metrics: ${monitor.getHealthSummary()}`);
  console.log(`Recovery actions taken: ${metrics.recoveryActions}`);
}

async function example6_ruleEngine() {
  console.log('\n=== Example 6: Rule Engine (All 12 Rules) ===\n');

  const engine = new RuleEngine();

  console.log(`Rules registered: ${engine.getRuleNames().length}`);
  for (const rule of engine.getRuleNames()) {
    console.log(`  ✓ ${rule}`);
  }

  // Test with a core tool
  const coreTool: any = {
    name: 'memory',
    core: true,
    priority: 10,
    enabled: true,
    lastUsed: Date.now(),
    demandLevel: 0,
    health: 'healthy'
  };

  const context = {
    currentActive: 45,
    minActive: 30,
    maxActive: 50,
    scalingTrigger: 256 as const,
    demandScores: new Map(),
    healthStatus: new Map(),
    demandThreshold: 3
  };

  const result = engine.evaluate(coreTool, context);
  console.log(`\nCore tool evaluation: ${result.passed ? 'PASS' : 'FAIL'}`);
  console.log(`Decision: ${result.decision.action} - ${result.decision.reason}`);
}

async function example7_integratedWorkflow() {
  console.log('\n=== Example 7: Integrated Workflow ===\n');

  const orch = createDynamicOrchestrator({
    minActiveTools: 30,
    maxActiveTools: 50,
    demandThreshold: 3
  });

  // Enable dynamic scaling
  orch.setScalingTrigger(256);

  // Simulate multiple tasks
  const tasks = [
    'Initialize a git repository',
    'Search web for TypeScript best practices',
    'Write unit tests for the utility functions',
    'Build and deploy the application',
    'Create database schema and run migrations'
  ];

  for (const task of tasks) {
    console.log(`\nTask: "${task}"`);
    const result = await orch.executeStep(task);
    console.log(`  → Activated ${result.tools.length} tools`);
    console.log(`  → Plan: ${result.executionPlan.join(', ')}`);
  }

  // Final status
  const status = orch.getStatus();
  console.log(`\nFinal state: ${status.activeCount} active, ${status.healthyCount} healthy`);
}

// Run examples based on argument
const args = process.argv.slice(2);
const exampleNum = args[0] ? parseInt(args[0]) : null;

async function main() {
  try {
    if (exampleNum === 1) await example1_basicOrchestration();
    else if (exampleNum === 2) await example2_scalingModes();
    else if (exampleNum === 3) await example3_semanticDetection();
    else if (exampleNum === 4) await example4_priorityPruning();
    else if (exampleNum === 5) await example5_healthMonitoring();
    else if (exampleNum === 6) await example6_ruleEngine();
    else if (exampleNum === 7) await example7_integratedWorkflow();
    else {
      console.log('Dynamic Orchestrator Examples\n');
      console.log('Usage: node examples/usage-example.js [1-7]');
      console.log('');
      console.log('Examples:');
      console.log('  1 - Basic orchestration');
      console.log('  2 - Scaling modes (trigger 256/210)');
      console.log('  3 - Semantic detection');
      console.log('  4 - Priority pruner');
      console.log('  5 - Health monitoring');
      console.log('  6 - Rule engine');
      console.log('  7 - Integrated workflow');
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
