# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\utils\nativeInstaller\index.ts
# Merge Date: 2026-05-07T19:18:40.921687
# ---

/**
 * Native Installer - Public API
 *
 * This is the barrel file that exports only the functions actually used by external modules.
 * External modules should only import from this file.
 */

// Re-export only the functions that are actually used
export {
  checkInstall,
  cleanupNpmInstallations,
  cleanupOldVersions,
  cleanupShellAliases,
  installLatest,
  lockCurrentVersion,
  removeInstalledSymlink,
  type SetupMessage,
} from './installer.js'
