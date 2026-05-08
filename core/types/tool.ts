/**
 * Tool definitions and schemas for cross-language compatibility.
 */

/** Tool input schema */
export interface ToolInputSchema {
  type: string;
  properties: Record<string, unknown>;
  required: string[];
}

/** Tool definition */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: ToolInputSchema;
}

/** Tool call */
export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

/** Tool result */
export class ToolResult {
  constructor(
    public toolUseId: string,
    public content: string,
    public isError: boolean,
  ) {}

  static success(toolUseId: string, content: string): ToolResult {
    return new ToolResult(toolUseId, content, false);
  }

  static error(toolUseId: string, message: string): ToolResult {
    return new ToolResult(toolUseId, message, true);
  }
}