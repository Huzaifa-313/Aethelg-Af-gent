import { describe, expect, test } from "bun:test";

import {
  CONTEXT_SUMMARY_MARKER,
  createContextSummaryMessage,
} from "../context/window-manager.js";
import { findLastUndoableUserMessageIndex } from "../daemon/conversation.js";
import type { Message } from "../providers/types.js";

function textMessage_v2(role: "user" | "assistant", text: string): Message {
  return { role, content: [{ type: "text", text }] };
}

describe("findLastUndoableUserMessageIndex", () => {
  test("returns -1 when only an internal context summary exists", () => {
    const messages = [
      createContextSummaryMessage("## Goals\n- remembered context"),
    ];
    expect(findLastUndoableUserMessageIndex(messages)).toBe(-1);
  });

  test("skips context summaries and tool-result-only user turns", () => {
    const messages: Message[] = [
      createContextSummaryMessage("## Goals\n- remembered context"),
      textMessage_v2("assistant", "older assistant reply"),
      {
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: "tool-1",
            content: "file contents",
          },
        ],
      },
      textMessage_v2("assistant", "tool follow-up"),
      textMessage_v2("user", "actual user prompt"),
      textMessage_v2("assistant", "actual assistant response"),
    ];

    expect(findLastUndoableUserMessageIndex(messages)).toBe(4);
  });

  test("considers user message with both tool_result and text as undoable", () => {
    // After repairHistory merges user(tool_result) + user(text), the merged
    // message contains both block types. It should still be undoable because
    // it contains user-authored content (the text block).
    const messages: Message[] = [
      textMessage_v2("assistant", "older assistant reply"),
      {
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: "tool-1",
            content: "file contents",
          },
          { type: "text", text: "user follow-up prompt" },
        ],
      },
      textMessage_v2("assistant", "response"),
    ];

    expect(findLastUndoableUserMessageIndex(messages)).toBe(1);
  });

  test("skips user message with only tool_result blocks", () => {
    const messages: Message[] = [
      {
        role: "user",
        content: [
          { type: "tool_result", tool_use_id: "tool-1", content: "result 1" },
          { type: "tool_result", tool_use_id: "tool-2", content: "result 2" },
        ],
      },
      textMessage_v2("assistant", "response"),
    ];

    expect(findLastUndoableUserMessageIndex(messages)).toBe(-1);
  });

  test("treats user-authored summary marker text as a normal user turn", () => {
    const spoofMessage = textMessage_v2(
      "user",
      `${CONTEXT_SUMMARY_MARKER}\nThis is ordinary user text, not internal summary state.`,
    );
    expect(findLastUndoableUserMessageIndex([spoofMessage])).toBe(0);
  });
});
