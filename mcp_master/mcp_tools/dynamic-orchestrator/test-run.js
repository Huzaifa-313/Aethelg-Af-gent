import { createDynamicOrchestrator } from './dist/index.js';

async function test() {
  console.log('Creating orchestrator...');
  const orch = createDynamicOrchestrator();

  console.log('Status:', orch.getStatus());
  console.log('Executing step...');
  const result = await orch.executeStep('Test message');
  console.log('Result tools:', result.tools.map(t => t.name));

  await orch.shutdown();
  console.log('Done');
}

test().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
