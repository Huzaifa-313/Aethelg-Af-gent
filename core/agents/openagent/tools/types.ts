# MERGED FROM: mythos/openagent-main
# DATE: 2026-05-08T06:16:21.795Z

import type { ProviderTool } from "../providers/types.js";

export interface ToolResult {
  output: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface ToolContext {
  cwd: string;
  abortSignal?: AbortSignal;
}

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  execute(input: Record<string, unknown>, context: ToolContext): Promise<ToolResult>;
}

export function toolToProviderFormat(tool: Tool): ProviderTool {
  return {
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  };
}
