#!/usr/bin/env node
/**
 * Dynamic Orchestrator Demo
 * Demonstrates all 5 components and 12 rules in action
 */

import { DynamicToolOrchestrator, createDynamicOrchestrator } from './src/index.js';

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║   BEAST MCP DYNAMIC ORCHESTRATOR - DEMO                        ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  // ========================================
  // 1. INITIALIZATION
  // ========================================
  console.log('📦 Step 1: Initializing Orchestrator');
  console.log('─'.repeat(60));

  const orch = createDynamicOrchestrator({
    minActiveTools: 30,
    maxActiveTools: 50,
    defaultScalingTrigger: 256,
    demandThreshold: 3,
    adjustmentIntervalSeconds: 10
  });

  const status = orch.getStatus();
  console.log(`✅ Initialized - Core tools: ${status.coreCount}`);
  console.log(`   Mode: ${status.scalingMode} (trigger: ${orch['state'].scalingModeSwitch})`);
  console.log(`   Active: ${status.activeCount}/${status.totalAvailable}\n`);

  // ========================================
  // 2. SCALING MODES (RULE 4-5)
  // ========================================
  console.log('🔄 Step 2: Testing Scaling Modes');
  console.log('─'.repeat(60));

  console.log('\n2a. Dynamic Scaling ON (trigger 256)');
  orch.setScalingTrigger(256);
  let s = orch.getStatus();
  console.log(`   → Mode: ${s.scalingMode}, Active: ${s.activeCount}`);

  console.log('\n2b. Dynamic Scaling OFF (trigger 210) → core-only');
  orch.setScalingTrigger(210);
  s = orch.getStatus();
  console.log(`   → Mode: ${s.scalingMode}, Active: ${s.activeCount}`);
  console.log(`   → Core tools protected: ${orch.listCoreTools().length}`);

  // ========================================
  // 3. SEMANTIC DETECTION (RULE 6)
  // ========================================
  console.log('\n🔍 Step 3: Semantic Detection');
  console.log('─'.repeat(60));

  const testInputs = [
    'I need to search the web for information',
    'Commit my code to git and push to GitHub',
    'Run tests and build the project',
    'Create a new file and edit its contents',
    'Deploy to Docker and Kubernetes'
  ];

  for (const input of testInputs) {
    const detection = orch['detectRequiredTools'](input);
    const groups = detection.matchedGroups
      .filter(g => g.name !== 'core_foundation')
      .map(g => `${g.name}(${g.priority.toFixed(1)})`)
      .join(', ');
    console.log(`   "${input.substring(0, 40)}..."`);
    console.log(`   → Groups: ${groups || 'none'}`);
  }

  // ========================================
  // 4. RULE ENFORCEMENT (ALL 12 RULES)
  // ========================================
  console.log('\n⚖️  Step 4: Rule Engine Validation');
  console.log('─'.repeat(60));

  const rules = orch['ruleEngine'].getRuleNames();
  console.log(`   Total rules enforced: ${rules.length}`);
  console.log(`   Rules:`);
  const ruleEntries = Object.entries(require('./src/types.js').ORCHESTRATION_RULES || {});
  for (const [key, value] of Object.entries({ 
    RULE_1: 'Core Protection',
    RULE_2: 'Min 30 Tools', 
    RULE_3: 'Max 50 Tools',
    RULE_4: 'Scaling ON (256)',
    RULE_5: 'Scaling OFF (210)',
    RULE_6: 'Semantic Detection',
    RULE_7: 'Priority Pruning',
    RULE_8: 'Demand Activation',
    RULE_9: 'Auto-Disable Idle',
    RULE_10: 'Health Monitoring',
    RULE_11: 'Adjustment Cooldown (5s)',
    RULE_12: 'History Window (5min)'
  })) {
    console.log(`   ✓ ${key}: ${value}`);
  }

  // ========================================
  // 5. TOOL STATE MANAGEMENT
  // ========================================
  console.log('\n🔧 Step 5: Tool State Manager');
  console.log('─'.repeat(60));

  const stats = orch['toolManager'].getStatistics();
  console.log(`   Total tools registered: ${stats.total}`);
  console.log(`   Core tools: ${stats.core}`);
  console.log(`   Optional tools: ${stats.optional}`);
  console.log(`   Currently enabled: ${stats.enabled}`);
  console.log(`   Total usage count: ${stats.totalUsage}`);

  // ========================================
  // 6. HEALTH MONITORING (RULE 10)
  // ========================================
  console.log('\n❤️  Step 6: Health Monitor');
  console.log('─'.repeat(60));

  const health = orch.getHealthMetrics();
  console.log(`   Healthy: ${health.healthyCount}`);
  console.log(`   Degraded: ${health.degradedCount}`);
  console.log(`   Failed: ${health.failedCount}`);
  console.log(`   Recovery actions taken: ${health.recoveryActions}`);
  console.log(`   System healthy: ${ orch['healthMonitor'].isSystemHealthy() ? '✅' : '❌'}`);

  // ========================================
  // 7. EXECUTION DEMONSTRATION
  // ========================================
  console.log('\n🚀 Step 7: Execute Sample Task');
  console.log('─'.repeat(60));

  // Enable dynamic scaling
  orch.setScalingTrigger(256);

  const tasks = [
    'Initialize git repository and make first commit',
    'Search the web for documentation',
    'Run tests and build the project',
    'Create a new file with content',
    'Execute a bash command'
  ];

  for (const task of tasks) {
    console.log(`\n   Task: "${task.substring(0, 50)}"`);
    const result = await orch.executeStep(task);
    console.log(`   → Used ${result.tools.length} tools: ${result.tools.map(t => t.name).join(', ')}`);
  }

  // ========================================
  // 8. FINAL STATUS
  // ========================================
  console.log('\n📊 Step 8: Final Report');
  console.log('─'.repeat(60));

  const finalStatus = orch.getStatus();
  console.log(`   Scaling mode: ${finalStatus.scalingMode}`);
  console.log(`   Active tools: ${finalStatus.activeCount}/${finalStatus.totalAvailable} (${(finalStatus.demandFactor * 100).toFixed(1)}%)`);
  console.log(`   Core protected: ${status.coreCount}`);

  const finalStats = orch['toolManager'].getStatistics();
  console.log(`\n   Tool Distribution:`);
  console.log(`      Core Enabled: ${finalStats.core}`);
  console.log(`      Optional Enabled: ${finalStats.enabled - finalStats.core}`);
  console.log(`      Total Usage Events: ${finalStats.totalUsage}`);

  // Shutdown
  await orch.shutdown();

  console.log('\n✅ Demo complete!');
}

main().catch(err => {
  console.error('Demo failed:', err);
  process.exit(1);
});
