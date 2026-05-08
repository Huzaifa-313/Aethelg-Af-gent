# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\tools\TaskStopTool\prompt.ts
# Merge Date: 2026-05-07T19:15:05.029452
# ---

export const TASK_STOP_TOOL_NAME = 'TaskStop'

export const DESCRIPTION = `
- Stops a running background task by its ID
- Takes a task_id parameter identifying the task to stop
- Returns a success or failure status
- Use this tool when you need to terminate a long-running task
`
