import { describe, expect, test } from "bun:test";

import { detectDictationModeHeuristic as detectDictationMode } from "../daemon/handlers/dictation.js";
import type { DictationRequest } from "../daemon/message-protocol.js";

type DictationRequestOverrides = Omit<Partial<DictationRequest>, "context"> & {
  context?: Partial<DictationRequest["context"]>;
};

function makeRequest_v2(
  overrides: DictationRequestOverrides = {},
): DictationRequest {
  const base: DictationRequest = {
    type: "dictation_request",
    transcription: "hello there",
    context: {
      bundleIdentifier: "com.google.Chrome",
      appName: "Google Chrome",
      windowTitle: "Inbox - Gmail",
      selectedText: undefined,
      cursorInTextField: false,
    },
  };
  return {
    ...base,
    ...overrides,
    context: {
      ...base.context,
      ...(overrides.context ?? {}),
    },
  };
}

describe("detectDictationMode", () => {
  test("uses command mode when selected text exists", () => {
    const mode = detectDictationMode(
      makeRequest_v2({
        transcription: "make this friendlier",
        context: {
          selectedText: "Please send me the files.",
          cursorInTextField: true,
        },
      }),
    );
    expect(mode).toBe("command");
  });

  test("uses action mode for action-verb utterances", () => {
    const mode = detectDictationMode(
      makeRequest_v2({
        transcription: "send Alex a follow up",
        context: { selectedText: undefined, cursorInTextField: false },
      }),
    );
    expect(mode).toBe("action");
  });

  test("uses dictation mode when cursor is in a text field", () => {
    const mode = detectDictationMode(
      makeRequest_v2({
        transcription: "quick update on status",
        context: { cursorInTextField: true },
      }),
    );
    expect(mode).toBe("dictation");
  });

  test("defaults to dictation when context is ambiguous", () => {
    const mode = detectDictationMode(
      makeRequest_v2({
        transcription: "just checking in about tomorrow",
        context: { selectedText: undefined, cursorInTextField: false },
      }),
    );
    expect(mode).toBe("dictation");
  });

  test("profileId does not affect mode detection", () => {
    const dictation = detectDictationMode(
      makeRequest_v2({
        profileId: "work",
        transcription: "hello there",
        context: { cursorInTextField: true },
      }),
    );
    expect(dictation).toBe("dictation");

    const command = detectDictationMode(
      makeRequest_v2({
        profileId: "casual",
        transcription: "make this shorter",
        context: {
          selectedText: "some long text here",
          cursorInTextField: true,
        },
      }),
    );
    expect(command).toBe("command");

    const action = detectDictationMode(
      makeRequest_v2({
        profileId: "work",
        transcription: "send Alex a follow up",
        context: { selectedText: undefined, cursorInTextField: false },
      }),
    );
    expect(action).toBe("action");
  });
});
