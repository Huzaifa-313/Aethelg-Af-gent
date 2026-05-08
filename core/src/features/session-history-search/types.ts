# AETHELGARD MERGED FILE
# Origin Repository: oh-my-claudecode-main
# Original Path: src\features\session-history-search\types.ts
# Merge Date: 2026-05-07T19:21:21.987722
# ---

export interface SessionHistorySearchOptions {
  query: string;
  limit?: number;
  since?: string;
  sessionId?: string;
  project?: string;
  caseSensitive?: boolean;
  contextChars?: number;
  workingDirectory?: string;
}

export interface SessionHistoryMatch {
  sessionId: string;
  agentId?: string;
  timestamp?: string;
  projectPath?: string;
  sourcePath: string;
  sourceType: 'project-transcript' | 'legacy-transcript' | 'omc-session-summary' | 'omc-session-replay';
  line: number;
  role?: string;
  entryType?: string;
  excerpt: string;
}

export interface SessionHistorySearchReport {
  query: string;
  scope: {
    mode: 'current' | 'project' | 'all';
    project?: string;
    workingDirectory?: string;
    since?: string;
    caseSensitive: boolean;
  };
  searchedFiles: number;
  totalMatches: number;
  results: SessionHistoryMatch[];
}
