# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\tools\TaskStopTool\prompt.ts
# Merge Date: 2026-05-07T19:18:29.562686
# ---

export const TASK_STOP_TOOL_NAME = 'TaskStop'

export const DESCRIPTION = `
- Stops a running background task by its ID
- Takes a task_id parameter identifying the task to stop
- Returns a success or failure status
- Use this tool when you need to terminate a long-running task
`
