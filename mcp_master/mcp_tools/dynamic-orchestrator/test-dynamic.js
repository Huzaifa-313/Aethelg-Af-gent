import { createDynamicOrchestrator, SWITCH_TRIGGER_ENABLE } from './dist/index.js';

async function testDynamic() {
  const orch = createDynamicOrchestrator({
    minActiveTools: 30,
    maxActiveTools: 50
  });

  console.log('=== Initial state (trigger 210 - core only) ===');
  let status = orch.getStatus();
  console.log(`Mode: ${status.scalingMode}, Active: ${status.activeCount}`);

  console.log('\n=== Enable dynamic scaling (trigger 256) ===');
  orch.setScalingTrigger(SWITCH_TRIGGER_ENABLE);
  status = orch.getStatus();
  console.log(`Mode: ${status.scalingMode}, Active: ${status.activeCount}`);

  console.log('\n=== Executing tasks to trigger demand ===');
  const tasks = [
    'Search the web for TypeScript documentation',
    'Git commit and push to remote repository',
    'Run unit tests and build the project',
    'Create new file and write code',
    'Deploy with Docker and Kubernetes'
  ];

  for (const task of tasks) {
    const result = await orch.executeStep(task);
    console.log(`Task: "${task.substring(0, 40)}..." → ${result.tools.length} tools`);
  }

  console.log('\n=== Final state ===');
  const final = orch.getStatus();
  console.log(`Active: ${final.activeCount}/${final.totalAvailable} (${(final.demandFactor*100).toFixed(1)}%)`);
  console.log(`Healthy: ${final.healthyCount}`);

  const health = orch.getHealthMetrics();
  console.log(`Health summary: ${orch['healthMonitor'].getHealthSummary()}`);

  await orch.shutdown();
}

testDynamic().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
