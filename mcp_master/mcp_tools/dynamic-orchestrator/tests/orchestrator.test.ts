/**
 * Unit tests for Dynamic Orchestrator
 */

import { DynamicToolOrchestrator, createDynamicOrchestrator } from '../src/index.js';

describe('DynamicToolOrchestrator', () => {
  let orchestrator: DynamicToolOrchestrator;

  beforeEach(async () => {
    orchestrator = createDynamicOrchestrator({
      minActiveTools: 30,
      maxActiveTools: 50,
      defaultScalingTrigger: 256
    });
  });

  afterEach(async () => {
    await orchestrator.shutdown();
  });

  describe('Initialization', () => {
    it('should initialize with core tools', () => {
      const status = orchestrator.getStatus();
      expect(status.coreCount).toBe(30);
      expect(status.totalAvailable).toBeGreaterThanOrEqual(30);
    });

    it('should start in correct scaling mode', () => {
      const status = orchestrator.getStatus();
      expect(status.scalingMode).toBe('ON'); // Default trigger 256
    });
  });

  describe('Scaling Triggers', () => {
    it('should enable dynamic scaling with trigger 256', () => {
      orchestrator.setScalingTrigger(256);
      const status = orchestrator.getStatus();
      expect(status.scalingMode).toBe('ON');
    });

    it('should disable to core-only with trigger 210', () => {
      orchestrator.setScalingTrigger(210);
      const status = orchestrator.getStatus();
      expect(status.scalingMode).toBe('OFF');
      expect(status.activeCount).toBe(30); // Core only
    });
  });

  describe('Tool Management', () => {
    it('should list core tools', () => {
      const core = orchestrator.listCoreTools();
      expect(core).toContain('memory');
      expect(core).toContain('filesystem');
      expect(core).toContain('bash');
      expect(core.length).toBe(30);
    });

    it('should force enable a tool', () => {
      const success = orchestrator.forceEnable('tavily');
      expect(success).toBe(true);
      const active = orchestrator.listActiveTools();
      expect(active.some(t => t.name === 'tavily')).toBe(true);
    });

    it('should not force disable core tools', () => {
      const success = orchestrator.forceDisable('memory');
      expect(success).toBe(false);
      const active = orchestrator.listActiveTools();
      expect(active.some(t => t.name === 'memory')).toBe(true);
    });
  });

  describe('Execution', () => {
    it('should execute a step and activate tools', async () => {
      const result = await orchestrator.executeStep('I need to search the web and commit code');

      expect(result).toBeDefined();
      expect(result.tools.length).toBeGreaterThan(0);
      expect(result.tools.some(t => t.name.includes('git') || t.name.includes('search') || t.name.includes('fetch'))).toBe(true);
    });

    it('should record tool usage', async () => {
      await orchestrator.executeStep('Run bash command');
      // Tool usage recorded internally
      const status = orchestrator.getStatus();
      expect(status.activeCount).toBeGreaterThanOrEqual(30);
    });
  });

  describe('Health Monitoring', () => {
    it('should provide health metrics', () => {
      const metrics = orchestrator.getHealthMetrics();
      expect(metrics.healthyCount).toBeGreaterThanOrEqual(0);
      expect(metrics.lastCheck).toBeDefined();
    });
  });

  describe('Configuration', () => {
    it('should return correct configuration', () => {
      const config = orchestrator.getConfig();
      expect(config.minActiveTools).toBe(30);
      expect(config.maxActiveTools).toBe(50);
      expect(config.demandThreshold).toBe(3);
    });
  });
});

describe('SemanticDetector', () => {
  let detector: SemanticDetector;

  beforeEach(() => {
    detector = new SemanticDetector();
  });

  it('should detect core foundation always', () => {
    const result = detector.analyzeInput('any input');
    expect(result.matchedGroups.some(g => g.name === 'core_foundation')).toBe(true);
  });

  it('should detect execution group for "run" keywords', () => {
    const result = detector.analyzeInput('run this command');
    expect(result.matchedGroups.some(g => g.name === 'execution')).toBe(true);
  });

  it('should return confidence score', () => {
    const result = detector.analyzeInput('search the web and commit to git');
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });
});

describe('PriorityPruner', () => {
  let pruner: PriorityPruner;

  beforeEach(() => {
    pruner = new PriorityPruner();
  });

  it('should always keep core tools', () => {
    const tools: any[] = [
      { name: 'memory', core: true, priority: 10, demandLevel: 0, health: 'healthy', enabled: true, lastUsed: Date.now(), usageCount: 0 }
    ];
    const context = {
      currentActive: 1,
      minActive: 30,
      maxActive: 50,
      scalingTrigger: 256 as const,
      demandScores: new Map(),
      healthStatus: new Map(),
      demandThreshold: 3
    };

    const { decisions } = pruner.prune(tools, context);
    const coreDecision = decisions.find(d => d.toolName === 'memory');
    expect(coreDecision?.action).toBe('keep');
  });

  it('should enforce max active count', () => {
    const tools = Array.from({ length: 60 }, (_, i) => ({
      name: `tool-${i}`,
      core: false,
      priority: 5,
      demandLevel: i,
      health: 'healthy' as const,
      enabled: true,
      lastUsed: Date.now(),
      usageCount: 1
    }));

    const context = {
      currentActive: 60,
      minActive: 30,
      maxActive: 50,
      scalingTrigger: 256 as const,
      demandScores: new Map(Array.from({ length: 60 }, (_, i) => [`tool-${i}`, i])),
      healthStatus: new Map(),
      demandThreshold: 3
    };

    const { finalActiveCount } = pruner.prune(tools, context);
    expect(finalActiveCount).toBe(50);
  });
});

describe('HealthMonitor', () => {
  let monitor: HealthMonitor;

  beforeEach(() => {
    monitor = new HealthMonitor();
  });

  it('should evaluate healthy for recently used tools', async () => {
    const toolStates = new Map();
    toolStates.set('test', {
      name: 'test',
      core: false,
      lastUsed: Date.now(),
      health: 'healthy',
      demandLevel: 0,
      usageCount: 1
    } as any);

    const metrics = await monitor.checkAndRecover(toolStates);
    expect(metrics.healthyCount).toBe(1);
    expect(metrics.failedCount).toBe(0);
  });

  it('should detect failed tools after long inactivity', async () => {
    const oldTime = Date.now() - 700000; // 11+ min
    const toolStates = new Map();
    toolStates.set('oldtool', {
      name: 'oldtool',
      core: false,
      lastUsed: oldTime,
      health: 'healthy',
      demandLevel: 0,
      usageCount: 1
    } as any);

    const metrics = await monitor.checkAndRecover(toolStates);
    expect(metrics.failedCount).toBe(1);
  });

  it('should report system health', () => {
    expect(monitor.isSystemHealthy()).toBe(true);
  });
});

describe('ToolManager', () => {
  let manager: ToolManager;

  beforeEach(() => {
    manager = new ToolManager();
  });

  it('should have 30 core tools initialized', () => {
    const tools = manager.getAllToolStates();
    const core = tools.filter(t => t.core);
    expect(core.length).toBe(30);
  });

  it('should have all core tools enabled by default', () => {
    const enabled = manager.getEnabledTools();
    const core = manager.getCoreTools();
    for (const coreTool of core) {
      expect(enabled).toContain(coreTool);
    }
  });

  it('should record usage and update counters', () => {
    manager.recordUsage('bash');
    const state = manager.getTool('bash');
    expect(state?.usageCount).toBe(1);
    expect(state?.lastUsed).toBeGreaterThan(0);
  });

  it('should not disable core tools', async () => {
    const success = await manager.disableTool('memory');
    expect(success).toBe(false);
    expect(manager.isEnabled('memory')).toBe(true);
  });
});

describe('RuleEngine', () => {
  let engine: RuleEngine;

  beforeEach(() => {
    engine = new RuleEngine();
  });

  it('should have 12 rules registered', () => {
    const rules = engine.getRuleNames();
    expect(rules.length).toBe(12);
  });

  it('should allow core tools always (Rule 1)', () => {
    const coreTool = {
      name: 'memory',
      core: true,
      priority: 10,
      enabled: true,
      lastUsed: Date.now(),
      demandLevel: 0,
      health: 'healthy' as const,
      semanticTags: []
    } as any;

    const context = {
      currentActive: 40,
      minActive: 30,
      maxActive: 50,
      scalingTrigger: 210 as const,
      demandScores: new Map(),
      healthStatus: new Map(),
      demandThreshold: 3
    };

    const result = engine.evaluate(coreTool, context);
    expect(result.passed).toBe(true);
    expect(result.decision.action).toBe('keep');
  });

  it('should enforce min tools rule (Rule 2)', () => {
    const nonCoreTool = {
      name: 'tavily',
      core: false,
      priority: 5,
      enabled: false,
      lastUsed: 0,
      demandLevel: 0,
      health: 'healthy' as const,
      semanticTags: []
    } as any;

    const context = {
      currentActive: 29, // Below minimum
      minActive: 30,
      maxActive: 50,
      scalingTrigger: 256 as const,
      demandScores: new Map(),
      healthStatus: new Map(),
      demandThreshold: 3
    };

    const result = engine.evaluate(nonCoreTool, context);
    // Below minimum suggests enabling high-priority tools
    expect(result.decision.action).toBe('enable');
  });
});
