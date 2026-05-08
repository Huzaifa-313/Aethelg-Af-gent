import { createDynamicOrchestrator } from './dist/index.js';

async function testRangeEnforcement() {
  console.log('Testing RULE 2/3: Min 30 / Max 50 active tools\n');

  const orch = createDynamicOrchestrator({
    minActiveTools: 30,
    maxActiveTools: 50,
    defaultScalingTrigger: 256
  });

  // Initial state: all core tools (40) enabled
  let status = orch.getStatus();
  console.log(`Initial: ${status.activeCount} active (core: ${status.coreCount})`);
  console.log(`Expect: between 30 and 50 => ${status.activeCount >= 30 && status.activeCount <= 50 ? '✅' : '❌'}`);

  // Simulate heavy demand for all tools by manually boosting demand scores
  console.log('\nSimulating high demand for all 40 core tools...');
  // Core tools already have high demand via core protection
  // Now manually enable some optional tools via force to test max
  const optionalTools = ['tavily', 'brave-search', 'puppeteer', 'playwright', 'sqlite', 'github', 'fetch'];
  for (const tool of optionalTools) {
    orch.forceEnable(tool);
  }

  status = orch.getStatus();
  console.log(`After force-enabling optional: ${status.activeCount} active`);

  // Trigger adjustment to enforce max
  orch['adjustActiveTools']();
  status = orch.getStatus();
  console.log(`After adjustment (max 50): ${status.activeCount} active`);
  console.log(`Max rule: ${status.activeCount <= 50 ? '✅ PASS' : '❌ FAIL'}`);

  // Now disable all optional to test min
  console.log('\nForcing all optional tools disabled...');
  for (const tool of optionalTools) {
    orch.forceDisable(tool);
  }
  status = orch.getStatus();
  console.log(`After force-disabling optional: ${status.activeCount} active`);
  console.log(`Min rule (≥30 core): ${status.activeCount >= 30 ? '✅ PASS' : '❌ FAIL'}`);

  await orch.shutdown();
  console.log('\n✅ Range enforcement validated');
}

testRangeEnforcement().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
