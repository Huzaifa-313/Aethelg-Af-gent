/**
 * Message types for cross-language compatibility.
 * Supports text, images, tool use, and thinking blocks.
 */

/** Role enum */
export type Role = 'user' | 'assistant';

/** Image source */
export type ImageSource =
  | { type: 'base64'; mediaType: string; data: string }
  | { type: 'url'; url: string };

/** Tool result content */
export type ToolResultContent = string | ContentBlock[];

/** Content block */
export type ContentBlock =
  | { type: 'text'; text: string }
  | { type: 'image'; source: ImageSource }
  | { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> }
  | { type: 'tool_result'; toolUseId: string; content: ToolResultContent; isError?: boolean }
  | { type: 'thinking'; thinking: string }
  | { type: 'server_tool_use'; id: string; name: string; input: Record<string, unknown> }
  | { type: 'server_tool_result'; toolUseId: string; content: Record<string, unknown> }
  | { type: 'unknown' };

/** Message */
export class Message {
  constructor(public role: Role, public content: ContentBlock[]) {}

  static user(text: string): Message {
    return new Message('user', [{ type: 'text', text }]);
  }

  static assistant(text: string): Message {
    return new Message('assistant', [{ type: 'text', text }]);
  }

  static userBlocks(content: ContentBlock[]): Message {
    return new Message('user', content);
  }

  textContent(): string {
    return this.content
      .filter(block => block.type === 'text')
      .map(block => (block as { type: 'text'; text: string }).text)
      .join('');
  }

  /** Check if a content block is a thinking block */
  static isThinking(block: ContentBlock): boolean {
    return block.type === 'thinking';
  }
}