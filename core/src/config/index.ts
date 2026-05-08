# AETHELGARD MERGED FILE
# Origin Repository: oh-my-claudecode-main
# Original Path: src\config\index.ts
# Merge Date: 2026-05-07T19:21:19.939807
# ---

/**
 * Configuration Module Exports
 */

export {
  loadConfig,
  loadJsoncFile,
  loadEnvConfig,
  getConfigPaths,
  deepMerge,
  findContextFiles,
  loadContextFromFiles,
  generateConfigSchema,
  DEFAULT_CONFIG,
} from "./loader.js";

export {
  DEFAULT_PLAN_OUTPUT_DIRECTORY,
  DEFAULT_PLAN_OUTPUT_FILENAME_TEMPLATE,
  getPlanOutputDirectory,
  getPlanOutputFilenameTemplate,
  resolvePlanOutputFilename,
  resolvePlanOutputPath,
  resolvePlanOutputAbsolutePath,
  resolveAutopilotPlanPath,
  resolveOpenQuestionsPlanPath,
} from "./plan-output.js";
