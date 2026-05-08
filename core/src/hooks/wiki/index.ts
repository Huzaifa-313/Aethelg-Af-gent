# AETHELGARD MERGED FILE
# Origin Repository: oh-my-claudecode-main
# Original Path: src\hooks\wiki\index.ts
# Merge Date: 2026-05-07T19:21:28.951755
# ---

/**
 * Wiki Module — Public API
 *
 * LLM Wiki: persistent, self-maintained markdown knowledge base
 * that compounds project and session knowledge across sessions.
 */

// Types
export type {
  WikiPage,
  WikiPageFrontmatter,
  WikiLogEntry,
  WikiIngestInput,
  WikiIngestResult,
  WikiQueryOptions,
  WikiQueryMatch,
  WikiLintIssue,
  WikiLintReport,
  WikiCategory,
  WikiConfig,
} from './types.js';

export { WIKI_SCHEMA_VERSION, DEFAULT_WIKI_CONFIG } from './types.js';

// Storage
export {
  getWikiDir,
  ensureWikiDir,
  withWikiLock,
  readPage,
  listPages,
  readAllPages,
  readIndex,
  readLog,
  writePage,
  deletePage,
  appendLog,
  titleToSlug,
  parseFrontmatter,
  serializePage,
  // Unsafe variants (for use inside withWikiLock)
  writePageUnsafe,
  deletePageUnsafe,
  updateIndexUnsafe,
  appendLogUnsafe,
} from './storage.js';

// Operations
export { ingestKnowledge } from './ingest.js';
export { queryWiki, tokenize } from './query.js';
export { lintWiki } from './lint.js';
