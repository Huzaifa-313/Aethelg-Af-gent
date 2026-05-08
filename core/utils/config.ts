// Unified configuration management for the AI framework.

import { randomBytes } from 'crypto';
import { unwatchFile, watchFile } from 'fs';
import memoize from 'lodash-es/memoize.js';
import pickBy from 'lodash-es/pickBy.js';
import { basename, dirname, join, resolve } from 'path';
import { getOriginalCwd } from '../bootstrap/state.js';
import { getAutoMemEntrypoint } from '../memdir/paths.js';
import { logEvent } from '../services/analytics/index.js';
import type { McpServerConfig } from '../services/mcp/types.js';
import type {
  BillingType,
  ReferralEligibilityResponse,
} from '../services/oauth/types.js';
import { getCwd } from './cwd.js';
import { registerCleanup } from './cleanupRegistry.js';
import { logForDebugging } from './debug.js';
import { logForDiagnosticsNoPII } from './diagLogs.js';
import { getGlobalClaudeFile } from './env.js';
import { getClaudeConfigHomeDir, isEnvTruthy } from './envUtils.js';
import { PikoError } from '../types/error.js';
import { writeFileSyncAndFlush_DEPRECATED } from './file.js';
import { getFsImplementation } from './fsOperations.js';
import { findCanonicalGitRoot } from './git.js';
import { safeParseJSON } from './json.js';
import { stripBOM } from './jsonRead.js';
import * as lockfile from './lockfile.js';
import { logError } from './log.js';
import type { MemoryType } from './memory/types.js';
import { normalizePathForConfigKey } from './path.js';
import { getEssentialTrafficOnlyReason } from './privacyLevel.js';
import { getManagedFilePath } from './settings/managedPath.js';
import type { ThemeSetting } from './theme.js';
import { jsonParse, jsonStringify } from './slowOperations.js';

// Re-entrancy guard for config reads
let insideGetConfig = false;

type InstallMethod = 'local' | 'native' | 'global' | 'unknown';
type NotificationChannel = 'auto' | 'system' | 'none';
type EditorMode = 'normal' | 'vim' | 'emacs';
type DiffTool = 'terminal' | 'auto';

// Image dimension info for coordinate mapping
export type PastedContent = {
  id: number;
  type: 'text' | 'image';
  content: string;
  mediaType?: string;
  filename?: string;
  dimensions?: { width: number; height: number };
  sourcePath?: string;
};

export interface SerializedStructuredHistoryEntry {
  display: string;
  pastedContents?: Record<number, PastedContent>;
  pastedText?: string;
}

export interface HistoryEntry {
  display: string;
  pastedContents: Record<number, PastedContent>;
}

export type ReleaseChannel = 'stable' | 'latest';

/** Project-specific configuration for agents */
export type ProjectConfig = {
  allowedTools: string[];
  mcpContextUris: string[];
  mcpServers?: Record<string, McpServerConfig>;
  lastAPIDuration?: number;
  lastAPIDurationWithoutRetries?: number;
  lastToolDuration?: number;
  lastCost?: number;
  lastDuration?: number;
  lastLinesAdded?: number;
  lastLinesRemoved?: number;
  lastTotalInputTokens?: number;
  lastTotalOutputTokens?: number;
  lastTotalCacheCreationInputTokens?: number;
  lastTotalCacheReadInputTokens?: number;
  lastTotalWebSearchRequests?: number;
  lastFpsAverage?: number;
  lastFpsLow1Pct?: number;
  lastSessionId?: string;
  lastModelUsage?: Record<
    string,
    {
      inputTokens: number;
      outputTokens: number;
      cacheReadInputTokens: number;
      cacheCreationInputTokens: number;
      webSearchRequests: number;
      costUSD: number;
    }
  >;
  lastSessionMetrics?: Record<string, number>;
  exampleFiles?: string[];
  exampleFilesGeneratedAt?: number;

  // Trust dialog settings
  hasTrustDialogAccepted?: boolean;
  hasCompletedProjectOnboarding?: boolean;
  projectOnboardingSeenCount: number;
  hasClaudeMdExternalIncludesApproved?: boolean;
  hasClaudeMdExternalIncludesWarningShown?: boolean;

  // MCP server approval fields
  enabledMcpjsonServers?: string[];
  disabledMcpjsonServers?: string[];
  enableAllProjectMcpServers?: boolean;
  disabledMcpServers?: string[];
  enabledMcpServers?: string[];

  // Worktree session management
  activeWorktreeSession?: {
    originalCwd: string;
    worktreePath: string;
    worktreeName: string;
    originalBranch?: string;
    sessionId: string;
    hookBased?: boolean;
  };
  remoteControlSpawnMode?: 'same-dir' | 'worktree';

  // Agent-specific additions
  coordinatorConfig?: CoordinatorConfig;
  toolboxConfig?: ToolboxConfig;
  undercoverEnabled?: boolean;
};

/** Default project config */
export const DEFAULT_PROJECT_CONFIG: ProjectConfig = {
  allowedTools: [],
  mcpContextUris: [],
  mcpServers: {},
  enabledMcpjsonServers: [],
  disabledMcpjsonServers: [],
  hasTrustDialogAccepted: false,
  projectOnboardingSeenCount: 0,
  hasClaudeMdExternalIncludesApproved: false,
  hasClaudeMdExternalIncludesWarningShown: false,
  undercoverEnabled: false,
};

interface AccountInfo {
  accountUuid: string;
  emailAddress: string;
  organizationUuid?: string;
  organizationName?: string | null;
  organizationRole?: string | null;
  displayName?: string;
  hasExtraUsageEnabled?: boolean;
  billingType?: BillingType | null;
  accountCreatedAt?: string;
  subscriptionCreatedAt?: string;
}

/** Global configuration for the unified framework */
export type GlobalConfig = {
  apiKeyHelper?: string;
  projects?: Record<string, ProjectConfig>;
  numStartups: number;
  installMethod?: InstallMethod;
  autoUpdates?: boolean;
  autoUpdatesProtectedForNative?: boolean;
  doctorShownAtSession?: number;
  userID?: string;
  theme: ThemeSetting;
  hasCompletedOnboarding?: boolean;
  lastOnboardingVersion?: string;
  lastReleaseNotesSeen?: string;
  changelogLastFetched?: number;
  cachedChangelog?: string;
  mcpServers?: Record<string, McpServerConfig>;
  claudeAiMcpEverConnected?: string[];
  preferredNotifChannel: NotificationChannel;
  customNotifyCommand?: string;
  verbose: boolean;
  customApiKeyResponses?: {
    approved?: string[];
    rejected?: string[];
  };
  primaryApiKey?: string;
  hasAcknowledgedCostThreshold?: boolean;
  hasSeenUndercoverAutoNotice?: boolean;
  hasSeenUltraplanTerms?: boolean;
  hasResetAutoModeOptInForDefaultOffer?: boolean;
  oauthAccount?: AccountInfo;
  iterm2KeyBindingInstalled?: boolean;
  editorMode?: EditorMode;
  bypassPermissionsModeAccepted?: boolean;
  hasUsedBackslashReturn?: boolean;
  autoCompactEnabled: boolean;
  showTurnDuration: boolean;
  env: { [key: string]: string };
  hasSeenTasksHint?: boolean;
  hasUsedStash?: boolean;
  hasUsedBackgroundTask?: boolean;
  queuedCommandUpHintCount?: number;
  diffTool?: DiffTool;

  // Terminal setup state tracking
  iterm2SetupInProgress?: boolean;
  iterm2BackupPath?: string;
  appleTerminalBackupPath?: string;
  appleTerminalSetupInProgress?: boolean;

  // IDE configurations
  autoConnectIde?: boolean;
  autoInstallIdeExtension?: boolean;

  // IDE dialogs
  hasIdeOnboardingBeenShown?: Record<string, boolean>;
  ideHintShownCount?: number;
  hasIdeAutoConnectDialogBeenShown?: boolean;

  tipsHistory: { [tipId: string]: number };
  companion?: any;
  companionMuted?: boolean;

  // Feedback survey tracking
  feedbackSurveyState?: {
    lastShownTime?: number;
  };
  transcriptShareDismissed?: boolean;
  memoryUsageCount: number;
  promptQueueUseCount: number;
  btwUseCount: number;
  todoFeatureEnabled: boolean;
  showExpandedTodos?: boolean;
  showSpinnerTree?: boolean;
  firstStartTime?: string;
  messageIdleNotifThresholdMs: number;
  githubActionSetupCount?: number;
  slackAppInstallCount?: number;
  fileCheckpointingEnabled: boolean;
  terminalProgressBarEnabled: boolean;
  showStatusInTerminalTab?: boolean;
  taskCompleteNotifEnabled?: boolean;
  inputNeededNotifEnabled?: boolean;
  agentPushNotifEnabled?: boolean;
  respectGitignore: boolean;
  copyFullResponse: boolean;
  copyOnSelect?: boolean;
  githubRepoPaths?: Record<string, string[]>;
  deepLinkTerminal?: string;
  iterm2It2SetupComplete?: boolean;
  preferTmuxOverIterm2?: boolean;

  // Skill usage tracking
  skillUsage?: Record<string, { usageCount: number; lastUsedAt: number }>;
  officialMarketplaceAutoInstallAttempted?: boolean;
  officialMarketplaceAutoInstalled?: boolean;
  officialMarketplaceAutoInstallFailReason?:
    | 'policy_blocked'
    | 'git_unavailable'
    | 'gcs_unavailable'
    | 'unknown';
  officialMarketplaceAutoInstallRetryCount?: number;
  officialMarketplaceAutoInstallLastAttemptTime?: number;
  officialMarketplaceAutoInstallNextRetryTime?: number;

  // Claude in Chrome settings
  hasCompletedClaudeInChromeOnboarding?: boolean;
  claudeInChromeDefaultEnabled?: boolean;
  cachedChromeExtensionInstalled?: boolean;

  // Chrome extension pairing state
  chromeExtension?: {
    pairedDeviceId?: string;
    pairedDeviceName?: string;
  };

  // LSP plugin recommendations
  lspRecommendationDisabled?: boolean;
  lspRecommendationNeverPlugins?: string[];
  lspRecommendationIgnoredCount?: number;

  // Claude Code hint protocol state
  claudeCodeHints?: {
    plugin?: string[];
    disabled?: boolean;
  };
  permissionExplainerEnabled?: boolean;
  teammateMode?: 'auto' | 'tmux' | 'in-process';
  teammateDefaultModel?: string | null;
  prStatusFooterEnabled?: boolean;
  tungstenPanelVisible?: boolean;
  penguinModeOrgEnabled?: boolean;
  startupPrefetchedAt?: number;
  remoteControlAtStartup?: boolean;
  cachedExtraUsageDisabledReason?: string | null;
  autoPermissionsNotificationCount?: number;
  speculationEnabled?: boolean;
  clientDataCache?: Record<string, unknown> | null;
  additionalModelOptionsCache?: any[];
  metricsStatusCache?: {
    enabled: boolean;
    timestamp: number;
  };
  migrationVersion?: number;

  // Agent/Orchestrator Additions
  coordinator?: CoordinatorConfig;
  toolbox?: ToolboxConfig;
  buddy?: BuddyConfig;
  undercover?: UndercoverConfig;
};

/** Coordinator-specific configuration */
export interface CoordinatorConfig {
  defaultModel?: string;
  maxConcurrentAgents?: number;
  idleTimeoutMs?: number;
  enableMistralReasoning?: boolean;
}

/** Toolbox-specific configuration */
export interface ToolboxConfig {
  dynamicToolRegistration?: boolean;
  maxRegisteredTools?: number;
  skillExecutionMode?: 'inline' | 'forked';
}

/** Buddy daemon configuration */
export interface BuddyConfig {
  logRetentionDays?: number;
  monitorIntervalMs?: number;
  periodicJobsEnabled?: boolean;
}

/** Undercover mode configuration */
export interface UndercoverConfig {
  enabled?: boolean;
  stealthLogging?: boolean;
  silentToolExecution?: boolean;
}

/** Default global config */
export function createDefaultGlobalConfig(): GlobalConfig {
  return {
    numStartups: 0,
    theme: 'dark',
    preferredNotifChannel: 'auto',
    verbose: false,
    editorMode: 'normal',
    autoCompactEnabled: true,
    showTurnDuration: true,
    customApiKeyResponses: {
      approved: [],
      rejected: [],
    },
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
    cachedStatsigGates: {},
    cachedDynamicConfigs: {},
    cachedGrowthBookFeatures: {},
    respectGitignore: true,
    copyFullResponse: false,
    permissionExplainerEnabled: true,
    prStatusFooterEnabled: true,
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

export const DEFAULT_GLOBAL_CONFIG: GlobalConfig = createDefaultGlobalConfig();

export const GLOBAL_CONFIG_KEYS = [
  'apiKeyHelper',
  'installMethod',
  'autoUpdates',
  'autoUpdatesProtectedForNative',
  'theme',
  'verbose',
  'preferredNotifChannel',
  'shiftEnterKeyBindingInstalled',
  'editorMode',
  'hasUsedBackslashReturn',
  'autoCompactEnabled',
  'showTurnDuration',
  'diffTool',
  'env',
  'tipsHistory',
  'todoFeatureEnabled',
  'showExpandedTodos',
  'messageIdleNotifThresholdMs',
  'autoConnectIde',
  'autoInstallIdeExtension',
  'fileCheckpointingEnabled',
  'terminalProgressBarEnabled',
  'showStatusInTerminalTab',
  'taskCompleteNotifEnabled',
  'inputNeededNotifEnabled',
  'agentPushNotifEnabled',
  'respectGitignore',
  'claudeInChromeDefaultEnabled',
  'hasCompletedClaudeInChromeOnboarding',
  'lspRecommendationDisabled',
  'lspRecommendationNeverPlugins',
  'lspRecommendationIgnoredCount',
  'copyFullResponse',
  'copyOnSelect',
  'permissionExplainerEnabled',
  'prStatusFooterEnabled',
  'remoteControlAtStartup',
  'remoteDialogSeen',
  'coordinator',
  'toolbox',
  'buddy',
  'undercover',
] as const;

export type GlobalConfigKey = (typeof GLOBAL_CONFIG_KEYS)[number];

export function isGlobalConfigKey(key: string): key is GlobalConfigKey {
  return GLOBAL_CONFIG_KEYS.includes(key as GlobalConfigKey);
}

export const PROJECT_CONFIG_KEYS = [
  'allowedTools',
  'hasTrustDialogAccepted',
  'hasCompletedProjectOnboarding',
  'coordinatorConfig',
  'toolboxConfig',
  'undercoverEnabled',
] as const;

export type ProjectConfigKey = (typeof PROJECT_CONFIG_KEYS)[number];

export function isProjectConfigKey(key: string): key is ProjectConfigKey {
  return PROJECT_CONFIG_KEYS.includes(key as ProjectConfigKey);
}

// --- Trust Dialog ---
let _trustAccepted = false;

export function resetTrustDialogAcceptedCacheForTesting(): void {
  _trustAccepted = false;
}

function getSessionTrustAccepted(): boolean {
  return false; // Stub
}

function computeTrustDialogAccepted(): boolean {
  if (getSessionTrustAccepted()) {
    return true;
  }

  const config = getGlobalConfig();
  const projectPath = getProjectPathForConfig();
  const projectConfig = config.projects?.[projectPath];
  if (projectConfig?.hasTrustDialogAccepted) {
    return true;
  }

  let currentPath = normalizePathForConfigKey(getCwd());
  while (true) {
    const pathConfig = config.projects?.[currentPath];
    if (pathConfig?.hasTrustDialogAccepted) {
      return true;
    }

    const parentPath = normalizePathForConfigKey(resolve(currentPath, '..'));
    if (parentPath === currentPath) {
      break;
    }
    currentPath = parentPath;
  }

  return false;
}

export function checkHasTrustDialogAccepted(): boolean {
  return (_trustAccepted ||= computeTrustDialogAccepted());
}

export function isPathTrusted(dir: string): boolean {
  const config = getGlobalConfig();
  let currentPath = normalizePathForConfigKey(resolve(dir));
  while (true) {
    if (config.projects?.[currentPath]?.hasTrustDialogAccepted) return true;
    const parentPath = normalizePathForConfigKey(resolve(currentPath, '..'));
    if (parentPath === currentPath) return false;
    currentPath = parentPath;
  }
}

// --- Config Operations ---

function wouldLoseAuthState(fresh: {
  oauthAccount?: unknown;
  hasCompletedOnboarding?: boolean;
}): boolean {
  return false; // Stub
}

// Config cache
let globalConfigCache: { config: GlobalConfig | null; mtime: number } = {
  config: null,
  mtime: 0,
};

function writeThroughGlobalConfigCache(config: GlobalConfig): void {
  globalConfigCache = { config, mtime: Date.now() };
}

// Stub for testing
const TEST_GLOBAL_CONFIG_FOR_TESTING: GlobalConfig = createDefaultGlobalConfig();

function getConfig<A>(file: string, createDefault: () => A): A {
  return createDefault(); // Stub
}

function saveConfig<A extends object>(file: string, config: A, defaultConfig: A): void {
  // Stub
}

function saveConfigWithLock<A extends object>(
  file: string,
  createDefault: () => A,
  mergeFn: (current: A) => A,
): boolean {
  return true; // Stub
}

function getProjectPathForConfig(): string {
  return normalizePathForConfigKey(resolve(getCwd()));
}

/**
 * Get the global config.
 * @returns The global config.
 */
export function getGlobalConfig(): GlobalConfig {
  if (process.env.NODE_ENV === 'test') {
    return TEST_GLOBAL_CONFIG_FOR_TESTING;
  }

  if (globalConfigCache.config) {
    return globalConfigCache.config;
  }

  const config = migrateConfigFields(createDefaultGlobalConfig());
  globalConfigCache = {
    config,
    mtime: Date.now(),
  };
  return config;
}

/**
 * Save the global config.
 * @param updater Function to update the config.
 */
export function saveGlobalConfig(
  updater: (currentConfig: GlobalConfig) => GlobalConfig,
): void {
  if (process.env.NODE_ENV === 'test') {
    const config = updater(TEST_GLOBAL_CONFIG_FOR_TESTING);
    if (config === TEST_GLOBAL_CONFIG_FOR_TESTING) return;
    Object.assign(TEST_GLOBAL_CONFIG_FOR_TESTING, config);
    return;
  }

  const currentConfig = getGlobalConfig();
  const newConfig = updater(currentConfig);
  if (newConfig === currentConfig) return;
  writeThroughGlobalConfigCache(newConfig);
}

function migrateConfigFields(config: GlobalConfig): GlobalConfig {
  return config;
}

function normalizePathForConfigKey(path: string): string {
  return path.replace(/\\/g, '/');
}