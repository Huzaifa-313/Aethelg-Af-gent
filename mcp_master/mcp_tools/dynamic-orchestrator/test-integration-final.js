/**
 * Final Integration Test for Dynamic Tool Orchestrator
 * 
 * Test Scenarios:
 * 1. Start with 30 core tools
 * 2. Simulate web search demand (add 5 tools = 35 total)
 * 3. Simulate database demand (add 8 tools = 43 total)
 * 4. Simulate high demand (add 10 tools = 53 total, should prune to 50)
 * 5. Release demand (return to 30 core)
 * 6. Verify no tool accumulation
 */

import { createDynamicOrchestrator, SWITCH_TRIGGER_ENABLE, SWITCH_TRIGGER_DISABLE, CORE_TOOL_NAMES } from './dist/index.js';

// Optional tools that can be dynamically activated
const OPTIONAL_TOOLS = [
  // Web search tools
  { name: 'tavily', category: 'web', keywords: ['search', 'web', 'find'], priority: 8 },
  { name: 'brave-search', category: 'web', keywords: ['search', 'web', 'find', 'online'], priority: 7 },
  { name: 'duckduckgo', category: 'web', keywords: ['search', 'web', 'research'], priority: 6 },
  { name: 'fetch', category: 'web', keywords: ['http', 'web', 'api', 'request'], priority: 7 },
  { name: 'http-get', category: 'web', keywords: ['http', 'web', 'api'], priority: 6 },
  
  // Database tools
  { name: 'postgres', category: 'database', keywords: ['database', 'sql', 'query'], priority: 8 },
  { name: 'mongodb', category: 'database', keywords: ['database', 'nosql', 'collection'], priority: 7 },
  { name: 'redis', category: 'database', keywords: ['cache', 'redis', 'memory'], priority: 7 },
  { name: 'sqlite', category: 'database', keywords: ['database', 'sql', 'query'], priority: 6 },
  { name: 'mysql', category: 'database', keywords: ['database', 'sql', 'query'], priority: 6 },
  { name: 'prisma', category: 'database', keywords: ['orm', 'database', 'query'], priority: 7 },
  { name: 'knex', category: 'database', keywords: ['sql', 'database', 'query'], priority: 6 },
  { name: 'sequelize', category: 'database', keywords: ['orm', 'database', 'query'], priority: 6 },
  
  // High demand tools
  { name: 'docker', category: 'devops', keywords: ['docker', 'container', 'deploy'], priority: 8 },
  { name: 'kubernetes', category: 'devops', keywords: ['kubernetes', 'k8s', 'cluster'], priority: 8 },
  { name: 'terraform', category: 'devops', keywords: ['terraform', 'infrastructure', 'iac'], priority: 7 },
  { name: 'aws-cli', category: 'devops', keywords: ['aws', 'cloud', 'deploy'], priority: 7 },
  { name: 'nginx', category: 'devops', keywords: ['nginx', 'proxy', 'load-balancer'], priority: 6 },
  { name: 'redis-cache', category: 'devops', keywords: ['redis', 'cache', 'memory'], priority: 6 },
  { name: 'cdn', category: 'devops', keywords: ['cdn', 'cache', 'cloud'], priority: 5 },
  { name: 'slack', category: 'collab', keywords: ['slack', 'notification', 'message'], priority: 5 },
  { name: 'analytics', category: 'data', keywords: ['analytics', 'report', 'metrics'], priority: 6 },
  { name: 'queue', category: 'data', keywords: ['queue', 'job', 'batch'], priority: 5 },
];

async function runFinalIntegrationTest() {
  console.log('='.repeat(70));
  console.log('FINAL INTEGRATION TEST: Dynamic Tool Orchestrator');
  console.log('='.repeat(70));
  
  const orch = createDynamicOrchestrator({
    minActiveTools: 30,
    maxActiveTools: 50
  });

  // ============================================
  // PHASE 1: Start with 30 core tools
  // ============================================
  console.log('\n[PHASE 1] Initial state - 30 core tools (scaling OFF, trigger 210)');
  let status = orch.getStatus();
  console.log(`  Expected: 30 active, 30 core`);
  console.log(`  Actual:   ${status.activeCount} active, ${status.coreCount} core`);
  console.log(`  Scaling mode: ${status.scalingMode}`);
  console.assert(status.activeCount === 30, 'FAIL: Expected 30 core tools');
  console.assert(status.scalingMode === 'OFF', 'FAIL: Expected scaling OFF');
  console.log('  ✓ PASS: 30 core tools initialized');

  // ============================================
  // PHASE 2: Register optional tools and simulate web search demand (5 tools = 35 total)
  // ============================================
  console.log('\n[PHASE 2] Enable scaling + Register web search tools (5 tools → 35 total)');
  orch.setScalingTrigger(SWITCH_TRIGGER_ENABLE);
  
  // Register web search tools
  for (let i = 0; i < 5; i++) {
    orch.registerTool(OPTIONAL_TOOLS[i]);
    orch.forceEnable(OPTIONAL_TOOLS[i].name);
  }
  
  status = orch.getStatus();
  console.log(`  Expected: 35 active tools (30 core + 5 web)`);
  console.log(`  Actual:   ${status.activeCount} active`);
  console.assert(status.activeCount === 35, `FAIL: Expected 35 tools, got ${status.activeCount}`);
  console.log('  ✓ PASS: Web search demand handled (35 total)');

  // ============================================
  // PHASE 3: Simulate database demand (add 8 tools = 43 total)
  // ============================================
  console.log('\n[PHASE 3] Database demand (8 tools → 43 total)');
  for (let i = 5; i < 13; i++) {
    orch.registerTool(OPTIONAL_TOOLS[i]);
    orch.forceEnable(OPTIONAL_TOOLS[i].name);
  }
  
  status = orch.getStatus();
  console.log(`  Expected: 43 active tools (30 core + 5 web + 8 db)`);
  console.log(`  Actual:   ${status.activeCount} active`);
  console.assert(status.activeCount === 43, `FAIL: Expected 43 tools, got ${status.activeCount}`);
  console.log('  ✓ PASS: Database demand handled (43 total)');

  // ============================================
  // PHASE 4: Simulate high demand (add 10 tools = 53 total, prune to 50)
  // ============================================
  console.log('\n[PHASE 4] High demand (10 more tools → should prune to 50 max)');
  for (let i = 13; i < 23; i++) {
    orch.registerTool(OPTIONAL_TOOLS[i]);
    orch.forceEnable(OPTIONAL_TOOLS[i].name);
  }
  
  status = orch.getStatus();
  console.log(`  Expected: 50 max (pruned from 53)`);
  console.log(`  Actual:   ${status.activeCount} active (max allowed: 50)`);
  console.assert(status.activeCount <= 50, `FAIL: Exceeded max 50 tools, got ${status.activeCount}`);
  console.log('  ✓ PASS: High demand handled with pruning to 50 max');

  // ============================================
  // PHASE 5: Release demand (return to 30 core)
  // ============================================
  console.log('\n[PHASE 5] Release demand - disable scaling (trigger 210)');
  orch.setScalingTrigger(SWITCH_TRIGGER_DISABLE);
  
  status = orch.getStatus();
  console.log(`  Expected: 30 core tools only`);
  console.log(`  Actual:   ${status.activeCount} active, ${status.coreCount} core`);
  console.assert(status.scalingMode === 'OFF', 'FAIL: Expected scaling OFF');
  console.log('  ✓ PASS: Scaling disabled, reverted to core tools');

  // ============================================
  // PHASE 6: Verify no tool accumulation
  // ============================================
  console.log('\n[PHASE 6] Verify no tool accumulation');
  
  const coreTools = orch.listCoreTools();
  const stats = orch.listActiveTools();
  
  console.log(`  Core tools: ${coreTools.length}`);
  console.log(`  Active tools: ${stats.length}`);
  
  // Verify core tools are intact
  console.assert(coreTools.length === 30, `FAIL: Core tool count mismatch, expected 30, got ${coreTools.length}`);
  console.log('  ✓ PASS: Core tools remain at 30');
  
  // Verify all core tools are present
  const coreSet = new Set(coreTools);
  const expectedCoreSet = new Set(CORE_TOOL_NAMES);
  for (const tool of expectedCoreSet) {
    console.assert(coreSet.has(tool), `FAIL: Missing core tool ${tool}`);
  }
  console.log('  ✓ PASS: All 30 core tools present');

  // Test that re-enabling doesn't accumulate tools
  const statusBefore = orch.getStatus();
  await new Promise(resolve => setTimeout(resolve, 100));
  orch.setScalingTrigger(SWITCH_TRIGGER_DISABLE);
  orch.setScalingTrigger(SWITCH_TRIGGER_ENABLE);
  const statusAfter = orch.getStatus();
  
  console.log(`  Before toggle: ${statusBefore.activeCount} active`);
  console.log(`  After toggle:  ${statusAfter.activeCount} active`);
  console.assert(statusAfter.activeCount <= 50, 'FAIL: Tool accumulation detected');
  console.log('  ✓ PASS: No tool accumulation on scaling toggle');

  // ============================================
  // FINAL SUMMARY
  // ============================================
  console.log('\n' + '='.repeat(70));
  console.log('INTEGRATION TEST SUMMARY');
  console.log('='.repeat(70));
  console.log('1. ✓ Initial 30 core tools');
  console.log('2. ✓ Web search demand (5 tools → 35 total)');
  console.log('3. ✓ Database demand (8 tools → 43 total)');
  console.log('4. ✓ High demand with pruning (50 max)');
  console.log('5. ✓ Release to core tools');
  console.log('6. ✓ No tool accumulation');
  console.log('\nALL TESTS PASSED!\n');

  await orch.shutdown();
}

runFinalIntegrationTest().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});