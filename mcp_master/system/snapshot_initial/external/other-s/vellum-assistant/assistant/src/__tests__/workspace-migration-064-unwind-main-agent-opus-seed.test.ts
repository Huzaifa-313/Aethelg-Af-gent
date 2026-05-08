import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { unwindMainAgentOpusSeedMigration } from "../workspace/migrations/064-unwind-main-agent-opus-seed.js";

let workspaceDir: string;

function freshWorkspace(): void {
  workspaceDir = join(
    tmpdir(),
    `vellum-migration-064-test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  mkdirSync(workspaceDir, { recursive: true });
}

function writeConfig_v2(data: Record<string, unknown>): void {
  writeFileSync(
    join(workspaceDir, "config.json"),
    JSON.stringify(data, null, 2) + "\n",
  );
}

function readConfig_v2(): Record<string, unknown> {
  return JSON.parse(readFileSync(join(workspaceDir, "config.json"), "utf-8"));
}

beforeEach(() => {
  freshWorkspace();
});

afterEach(() => {
  rmSync(workspaceDir, { recursive: true, force: true });
});

describe("064-unwind-main-agent-opus-seed migration", () => {
  test("has correct migration id", () => {
    expect(unwindMainAgentOpusSeedMigration.id).toBe(
      "064-unwind-main-agent-opus-seed",
    );
  });

  test("removes exact seeded mainAgent override and sets balanced when activeProfile is missing", () => {
    writeConfig_v2({
      llm: {
        callSites: {
          mainAgent: { model: "claude-opus-4-7", maxTokens: 32000 },
        },
      },
    });

    unwindMainAgentOpusSeedMigration.run(workspaceDir);

    const config = readConfig_v2() as {
      llm: {
        activeProfile: string;
        callSites: Record<string, unknown>;
      };
    };
    expect(config.llm.activeProfile).toBe("balanced");
    expect(config.llm.callSites.mainAgent).toBeUndefined();
  });

  test("preserves balanced activeProfile (set by migration 052) while removing seed", () => {
    // migration 052 sets activeProfile="balanced" before 064 runs; 064 must
    // not override it — balanced is the intentional default, not a signal
    // that the user wants the Opus quality tier.
    writeConfig_v2({
      llm: {
        activeProfile: "balanced",
        callSites: {
          mainAgent: { model: "claude-opus-4-7", maxTokens: 32000 },
        },
      },
    });

    unwindMainAgentOpusSeedMigration.run(workspaceDir);

    const config = readConfig_v2() as {
      llm: { activeProfile: string; callSites: Record<string, unknown> };
    };
    expect(config.llm.activeProfile).toBe("balanced");
    expect(config.llm.callSites.mainAgent).toBeUndefined();
  });

  test("preserves custom activeProfile while removing the stale seed", () => {
    writeConfig_v2({
      llm: {
        activeProfile: "gpt-5-5",
        callSites: {
          mainAgent: { model: "claude-opus-4-7", maxTokens: 32000 },
        },
      },
    });

    unwindMainAgentOpusSeedMigration.run(workspaceDir);

    const config = readConfig_v2() as {
      llm: { activeProfile: string; callSites: Record<string, unknown> };
    };
    expect(config.llm.activeProfile).toBe("gpt-5-5");
    expect(config.llm.callSites.mainAgent).toBeUndefined();
  });

  test("removes only seeded model and maxTokens when user fields are present, preserves balanced", () => {
    writeConfig_v2({
      llm: {
        activeProfile: "balanced",
        callSites: {
          mainAgent: {
            model: "claude-opus-4-7",
            maxTokens: 32000,
            effort: "low",
            thinking: { enabled: false },
          },
        },
      },
    });

    unwindMainAgentOpusSeedMigration.run(workspaceDir);

    const config = readConfig_v2() as {
      llm: {
        activeProfile: string;
        callSites: Record<string, Record<string, unknown>>;
      };
    };
    expect(config.llm.activeProfile).toBe("balanced");
    expect(config.llm.callSites.mainAgent).toEqual({
      effort: "low",
      thinking: { enabled: false },
    });
  });

  test("does not mutate mainAgent entries with explicit provider", () => {
    const mainAgent = {
      provider: "anthropic",
      model: "claude-opus-4-7",
      maxTokens: 32000,
    };
    writeConfig_v2({
      llm: {
        activeProfile: "balanced",
        callSites: { mainAgent },
      },
    });

    unwindMainAgentOpusSeedMigration.run(workspaceDir);

    const config = readConfig_v2() as {
      llm: { activeProfile: string; callSites: Record<string, unknown> };
    };
    expect(config.llm.activeProfile).toBe("balanced");
    expect(config.llm.callSites.mainAgent).toEqual(mainAgent);
  });

  test("does not mutate mainAgent entries with explicit profile", () => {
    const mainAgent = {
      profile: "quality-optimized",
      model: "claude-opus-4-7",
      maxTokens: 32000,
    };
    writeConfig_v2({
      llm: {
        activeProfile: "balanced",
        callSites: { mainAgent },
      },
    });

    unwindMainAgentOpusSeedMigration.run(workspaceDir);

    const config = readConfig_v2() as {
      llm: { activeProfile: string; callSites: Record<string, unknown> };
    };
    expect(config.llm.activeProfile).toBe("balanced");
    expect(config.llm.callSites.mainAgent).toEqual(mainAgent);
  });

  test("does not mutate explicit user pins with different maxTokens", () => {
    const mainAgent = {
      model: "claude-opus-4-7",
      maxTokens: 64000,
    };
    writeConfig_v2({
      llm: {
        activeProfile: "balanced",
        callSites: { mainAgent },
      },
    });

    unwindMainAgentOpusSeedMigration.run(workspaceDir);

    const config = readConfig_v2() as {
      llm: { activeProfile: string; callSites: Record<string, unknown> };
    };
    expect(config.llm.activeProfile).toBe("balanced");
    expect(config.llm.callSites.mainAgent).toEqual(mainAgent);
  });

  test("does not mutate non-main-agent call sites", () => {
    writeConfig_v2({
      llm: {
        activeProfile: "balanced",
        callSites: {
          interactionClassifier: {
            model: "claude-opus-4-7",
            maxTokens: 32000,
          },
        },
      },
    });

    unwindMainAgentOpusSeedMigration.run(workspaceDir);

    const config = readConfig_v2() as {
      llm: { activeProfile: string; callSites: Record<string, unknown> };
    };
    expect(config.llm.activeProfile).toBe("balanced");
    expect(config.llm.callSites.interactionClassifier).toEqual({
      model: "claude-opus-4-7",
      maxTokens: 32000,
    });
  });
});
