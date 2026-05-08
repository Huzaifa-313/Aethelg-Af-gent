# AETHELGARD MERGED FILE
# Origin Repository: oh-my-claudecode-main
# Original Path: src\tools\lsp\index.ts
# Merge Date: 2026-05-07T19:21:39.729307
# ---

/**
 * LSP Module Exports
 */

export { LspClient, lspClientManager, disconnectAll, DEFAULT_LSP_REQUEST_TIMEOUT_MS } from './client.js';
export type {
  Position,
  Range,
  Location,
  Hover,
  Diagnostic,
  DocumentSymbol,
  SymbolInformation,
  WorkspaceEdit,
  CodeAction
} from './client.js';

export {
  LSP_SERVERS,
  getServerForFile,
  getServerForLanguage,
  getAllServers,
  commandExists
} from './servers.js';
export type { LspServerConfig } from './servers.js';

export {
  resolveDevContainerContext,
  hostPathToContainerPath,
  containerPathToHostPath,
  hostUriToContainerUri,
  containerUriToHostUri
} from './devcontainer.js';
export type { DevContainerContext } from './devcontainer.js';

export {
  uriToPath,
  formatPosition,
  formatRange,
  formatLocation,
  formatHover,
  formatLocations,
  formatDocumentSymbols,
  formatWorkspaceSymbols,
  formatDiagnostics,
  formatCodeActions,
  formatWorkspaceEdit,
  countEdits
} from './utils.js';
