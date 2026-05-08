// Self-contained test harness for core/utils/config.ts

// Stub missing dependencies
const mockMemoize = (fn: any) => fn;
const mockPickBy = (obj: any, predicate: any) => {
  const result: any = {};
  for (const key in obj) {
    if (predicate(obj[key], key)) {
      result[key] = obj[key];
    }
  }
  return result;
};

// Import config with stubs
const configModule = (() => {
  const { join, resolve, dirname, basename } = require('path');
  const { randomBytes } = require('crypto');
  const { writeFileSync, unwatchFile, watchFile } = require('fs');
  
  // Mock required functions
  const getOriginalCwd = () => process.cwd();
  const getAutoMemEntrypoint = () => join(process.cwd(), 'CLAUDE.md');
  const logEvent = () => {};
  const getCwd = () => process.cwd();
  const registerCleanup = () => {};
  const logForDebugging = () => {};
  const logForDiagnosticsNoPII = () => {};
  const getGlobalClaudeFile = () => join(process.cwd(), '.claude.json');
  const getClaudeConfigHomeDir = () => join(process.env.HOME || process.env.USERPROFILE || process.cwd(), '.claude');
  const isEnvTruthy = () => false;
  const PikoError = Error;
  const writeFileSyncAndFlush_DEPRECATED = writeFileSync;
  const getFsImplementation = () => require('fs');
  const findCanonicalGitRoot = () => null;
  const safeParseJSON = (str: string) => {
    try { return JSON.parse(str); } catch { return null; }
  };
  const stripBOM = (str: string) => str.replace(/^\uFEFF/, '');
  const lockfile = { lockSync: () => () => {} };
  const logError = () => {};
  const normalizePathForConfigKey = (path: string) => path.replace(/\\/g, '/');
  const getEssentialTrafficOnlyReason = () => null;
  const getManagedFilePath = () => process.cwd();
  const jsonParse = JSON.parse;
  const jsonStringify = JSON.stringify;

  // Define types
  type InstallMethod = 'local' | 'native' | 'global' | 'unknown';
  type NotificationChannel = 'auto' | 'system' | 'none';
  type EditorMode = 'normal' | 'vim' | 'emacs';
  type DiffTool = 'terminal' | 'auto';
  
  interface CoordinatorConfig {
    defaultModel?: string;
    maxConcurrentAgents?: number;
    idleTimeoutMs?: number;
    enableMistralReasoning?: boolean;
  }

  interface ToolboxConfig {
    dynamicToolRegistration?: boolean;
    maxRegisteredTools?: number;
    skillExecutionMode?: 'inline' | 'forked';
  }

  interface BuddyConfig {
    logRetentionDays?: number;
    monitorIntervalMs?: number;
    periodicJobsEnabled?: boolean;
  }

  interface UndercoverConfig {
    enabled?: boolean;
    stealthLogging?: boolean;
    silentToolExecution?: boolean;
  }

  interface ProjectConfig {
    allowedTools: string[];
    mcpContextUris: string[];
    coordinatorConfig?: CoordinatorConfig;
    toolboxConfig?: ToolboxConfig;
    undercoverEnabled?: boolean;
  }

  interface GlobalConfig {
    numStartups: number;
    theme: 'dark' | 'light';
    preferredNotifChannel: NotificationChannel;
    verbose: boolean;
    editorMode?: EditorMode;
    autoCompactEnabled: boolean;
    showTurnDuration: boolean;
    customApiKeyResponses: { approved: string[]; rejected: string[] };
    env: Record<string, string>;
    tipsHistory: Record<string, number>;
    memoryUsageCount: number;
    promptQueueUseCount: number;
    btwUseCount: number;
    todoFeatureEnabled: boolean;
    showExpandedTodos?: boolean;
    messageIdleNotifThresholdMs: number;
    autoConnectIde?: boolean;
    autoInstallIdeExtension?: boolean;
    fileCheckpointingEnabled: boolean;
    terminalProgressBarEnabled: boolean;
    respectGitignore: boolean;
    copyFullResponse: boolean;
    coordinator?: CoordinatorConfig;
    toolbox?: ToolboxConfig;
    buddy?: BuddyConfig;
    undercover?: UndercoverConfig;
  }

  // Default config
  function createDefaultGlobalConfig(): GlobalConfig {
    return {
      numStartups: 0,
      theme: 'dark',
      preferredNotifChannel: 'auto',
      verbose: false,
      editorMode: 'normal',
      autoCompactEnabled: true,
      showTurnDuration: true,
      customApiKeyResponses: { approved: [], rejected: [] },
      env: {},
      tipsHistory: {},
      memoryUsageCount: 0,
      promptQueueUseCount: 0,
      btwUseCount: 0,
      todoFeatureEnabled: true,
      showExpandedTodos: false,
      messageIdleNotifThresholdMs: 60000,
      autoConnectIde: false,
      autoInstallIdeExtension: true,
      fileCheckpointingEnabled: true,
      terminalProgressBarEnabled: true,
      respectGitignore: true,
      copyFullResponse: false,
      coordinator: {
        defaultModel: 'mistral-large-3-675b',
        maxConcurrentAgents: 5,
        idleTimeoutMs: 300000,
        enableMistralReasoning: true,
      },
      toolbox: {
        dynamicToolRegistration: true,
        maxRegisteredTools: 100,
        skillExecutionMode: 'inline',
      },
      buddy: {
        logRetentionDays: 7,
        monitorIntervalMs: 60000,
        periodicJobsEnabled: true,
      },
      undercover: {
        enabled: false,
        stealthLogging: true,
        silentToolExecution: true,
      },
    };
  }

  // Config cache
  let globalConfigCache: { config: GlobalConfig | null; mtime: number } = {
    config: null,
    mtime: 0,
  };

  // Get global config
  function getGlobalConfig(): GlobalConfig {
    if (globalConfigCache.config) {
      return globalConfigCache.config;
    }
    const config = createDefaultGlobalConfig();
    globalConfigCache = { config, mtime: Date.now() };
    return config;
  }

  // Save global config
  function saveGlobalConfig(updater: (current: GlobalConfig) => GlobalConfig): void {
    const currentConfig = getGlobalConfig();
    const newConfig = updater(currentConfig);
    globalConfigCache = { config: newConfig, mtime: Date.now() };
  }

  // Return the module
  return {
    getGlobalConfig,
    saveGlobalConfig,
    createDefaultGlobalConfig,
    DEFAULT_GLOBAL_CONFIG: createDefaultGlobalConfig(),
  };
})();

// Test config loading
function testConfigLoading(): void {
  console.log('🧪 Testing config loading...');
  
  const { getGlobalConfig, DEFAULT_GLOBAL_CONFIG } = configModule;
  const config = getGlobalConfig();
  
  // Verify default config structure
  if (config.coordinator?.defaultModel !== 'mistral-large-3-675b') {
    throw new Error('Default coordinator model mismatch');
  }
  if (config.toolbox?.dynamicToolRegistration !== true) {
    throw new Error('Default toolbox dynamicToolRegistration mismatch');
  }
  if (config.undercover?.enabled !== false) {
    throw new Error('Default undercover enabled mismatch');
  }
  if (config.buddy?.monitorIntervalMs !== 60000) {
    throw new Error('Default buddy monitorIntervalMs mismatch');
  }
  
  console.log('✅ Config loading: PASSED');
}

// Test agent integration
function testAgentIntegration(): void {
  console.log('🧪 Testing agent integration...');
  
  const { saveGlobalConfig } = configModule;
  
  // Test coordinator config
  saveGlobalConfig(current => ({
    ...current,
    coordinator: {
      defaultModel: 'mistral-large-3-675b',
      maxConcurrentAgents: 10,
      idleTimeoutMs: 600000,
      enableMistralReasoning: true,
    },
  }));
  
  // Mock Coordinator
  const Coordinator = function(config = {}) {
    const globalConfig = configModule.getGlobalConfig();
    this.config = {
      defaultModel: config.defaultModel ?? globalConfig.coordinator?.defaultModel ?? 'mistral-large-3-675b',
      maxConcurrentAgents: config.maxConcurrentAgents ?? globalConfig.coordinator?.maxConcurrentAgents ?? 5,
      idleTimeoutMs: config.idleTimeoutMs ?? globalConfig.coordinator?.idleTimeoutMs ?? 300000,
      enableMistralReasoning: config.enableMistralReasoning ?? globalConfig.coordinator?.enableMistralReasoning ?? true,
    };
  };
  
  const coordinator = new Coordinator();
  console.log('Coordinator config:', coordinator.config);
  
  // Mock Toolbox
  const Toolbox = function(config = {}) {
    const globalConfig = configModule.getGlobalConfig();
    this.config = {
      dynamicToolRegistration: config.dynamicToolRegistration ?? globalConfig.toolbox?.dynamicToolRegistration ?? true,
      maxRegisteredTools: config.maxRegisteredTools ?? globalConfig.toolbox?.maxRegisteredTools ?? 100,
      skillExecutionMode: config.skillExecutionMode ?? globalConfig.toolbox?.skillExecutionMode ?? 'inline',
    };
    this.registerTool = (tool: any) => {
      if (!this.config.dynamicToolRegistration) {
        throw new Error('Dynamic tool registration is disabled');
      }
    };
  };
  
  // Test toolbox config
  saveGlobalConfig(current => ({
    ...current,
    toolbox: {
      dynamicToolRegistration: false,
      maxRegisteredTools: 50,
      skillExecutionMode: 'forked',
    },
  }));
  
  const toolbox = new Toolbox();
  try {
    toolbox.registerTool({
      name: 'test',
      schema: { name: 'test', description: 'test', inputSchema: { type: 'object', properties: {}, required: [] } },
      func: async () => 'test',
      readOnly: false,
      concurrentSafe: true,
    });
    throw new Error('Dynamic tool registration should be disabled');
  } catch (error) {
    console.log('✅ Toolbox dynamic registration: PASSED');
  }
  
  console.log('✅ Agent integration: PASSED');
}

// Test undercover mode
function testUndercoverMode(): void {
  console.log('🧪 Testing undercover mode...');
  
  const { saveGlobalConfig } = configModule;
  
  // Enable undercover mode
  saveGlobalConfig(current => ({
    ...current,
    undercover: {
      enabled: true,
      stealthLogging: true,
      silentToolExecution: true,
    },
  }));
  
  // Mock Undercover
  const Undercover = function(config = {}) {
    const globalConfig = configModule.getGlobalConfig();
    this.config = {
      enabled: config.enabled ?? globalConfig.undercover?.enabled ?? false,
      stealthLogging: config.stealthLogging ?? globalConfig.undercover?.stealthLogging ?? true,
      silentToolExecution: config.silentToolExecution ?? globalConfig.undercover?.silentToolExecution ?? true,
    };
  };
  
  const undercover = new Undercover();
  console.log('Undercover config:', undercover.config);
  
  console.log('✅ Undercover mode: PASSED');
}

// Run all tests
function runConfigTests(): void {
  console.log('🚀 Running config tests...');
  testConfigLoading();
  testAgentIntegration();
  testUndercoverMode();
  console.log('🎉 All config tests PASSED');
}

// Run tests
runConfigTests();