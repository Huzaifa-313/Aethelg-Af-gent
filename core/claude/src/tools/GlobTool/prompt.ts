# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\tools\GlobTool\prompt.ts
# Merge Date: 2026-05-07T19:15:03.037456
# ---

export const GLOB_TOOL_NAME = 'Glob'

export const DESCRIPTION = `- Fast file pattern matching tool that works with any codebase size
- Supports glob patterns like "**/*.js" or "src/**/*.ts"
- Returns matching file paths sorted by modification time
- Use this tool when you need to find files by name patterns
- When you are doing an open ended search that may require multiple rounds of globbing and grepping, use the Agent tool instead`
