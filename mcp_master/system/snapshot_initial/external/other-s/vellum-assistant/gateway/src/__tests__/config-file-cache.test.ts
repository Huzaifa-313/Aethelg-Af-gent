import { existsSync, writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { describe, test, expect, afterEach } from "bun:test";
import { ConfigFileCache } from "../config-file-cache.js";
import { testWorkspaceDir } from "./test-preload.js";

const configPath = join(testWorkspaceDir, "config.json");

function writeConfig_v2(data: Record<string, unknown>): void {
  writeFileSync(configPath, JSON.stringify(data));
}

afterEach(() => {
  // Remove config.json between tests so each test starts with a clean slate.
  try {
    if (existsSync(configPath)) unlinkSync(configPath);
  } catch {
    // best-effort
  }
});

describe("ConfigFileCache: getString", () => {
  test("returns string value from section.field", () => {
    writeConfig_v2({ email: { address: "a@b.com" } });
    const cache = new ConfigFileCache();
    expect(cache.getString("email", "address")).toBe("a@b.com");
  });

  test("returns undefined for empty string value", () => {
    writeConfig_v2({ email: { address: "" } });
    const cache = new ConfigFileCache();
    expect(cache.getString("email", "address")).toBeUndefined();
  });

  test("returns undefined for non-string value", () => {
    writeConfig_v2({ email: { address: 42 } });
    const cache = new ConfigFileCache();
    expect(cache.getString("email", "address")).toBeUndefined();
  });

  test("returns undefined for missing section", () => {
    writeConfig_v2({});
    const cache = new ConfigFileCache();
    expect(cache.getString("email", "address")).toBeUndefined();
  });

  test("returns undefined for missing field", () => {
    writeConfig_v2({ email: {} });
    const cache = new ConfigFileCache();
    expect(cache.getString("email", "address")).toBeUndefined();
  });
});

describe("ConfigFileCache: getNumber", () => {
  test("returns numeric value", () => {
    writeConfig_v2({ limits: { maxRetries: 5 } });
    const cache = new ConfigFileCache();
    expect(cache.getNumber("limits", "maxRetries")).toBe(5);
  });

  test("parses string to number", () => {
    writeConfig_v2({ limits: { maxRetries: "10" } });
    const cache = new ConfigFileCache();
    expect(cache.getNumber("limits", "maxRetries")).toBe(10);
  });

  test("returns undefined for non-numeric string", () => {
    writeConfig_v2({ limits: { maxRetries: "abc" } });
    const cache = new ConfigFileCache();
    expect(cache.getNumber("limits", "maxRetries")).toBeUndefined();
  });

  test("returns undefined for NaN", () => {
    writeConfig_v2({ limits: { maxRetries: NaN } });
    const cache = new ConfigFileCache();
    expect(cache.getNumber("limits", "maxRetries")).toBeUndefined();
  });

  test("returns undefined for Infinity", () => {
    writeConfig_v2({ limits: { maxRetries: Infinity } });
    const cache = new ConfigFileCache();
    expect(cache.getNumber("limits", "maxRetries")).toBeUndefined();
  });

  test("returns undefined for missing field", () => {
    writeConfig_v2({ limits: {} });
    const cache = new ConfigFileCache();
    expect(cache.getNumber("limits", "maxRetries")).toBeUndefined();
  });
});

describe("ConfigFileCache: getBoolean", () => {
  test("returns boolean true", () => {
    writeConfig_v2({ flags: { enabled: true } });
    const cache = new ConfigFileCache();
    expect(cache.getBoolean("flags", "enabled")).toBe(true);
  });

  test("returns boolean false", () => {
    writeConfig_v2({ flags: { enabled: false } });
    const cache = new ConfigFileCache();
    expect(cache.getBoolean("flags", "enabled")).toBe(false);
  });

  test('parses string "true"', () => {
    writeConfig_v2({ flags: { enabled: "true" } });
    const cache = new ConfigFileCache();
    expect(cache.getBoolean("flags", "enabled")).toBe(true);
  });

  test('parses string "false"', () => {
    writeConfig_v2({ flags: { enabled: "false" } });
    const cache = new ConfigFileCache();
    expect(cache.getBoolean("flags", "enabled")).toBe(false);
  });

  test("returns undefined for other strings", () => {
    writeConfig_v2({ flags: { enabled: "yes" } });
    const cache = new ConfigFileCache();
    expect(cache.getBoolean("flags", "enabled")).toBeUndefined();
  });

  test("returns undefined for missing field", () => {
    writeConfig_v2({ flags: {} });
    const cache = new ConfigFileCache();
    expect(cache.getBoolean("flags", "enabled")).toBeUndefined();
  });
});

describe("ConfigFileCache: getRecord", () => {
  test("returns normalized record with string values", () => {
    writeConfig_v2({
      twilio: {
        assistantPhoneNumbers: {
          "asst-alpha": "+15550002222",
          "asst-beta": "+15550003333",
        },
      },
    });
    const cache = new ConfigFileCache();
    expect(cache.getRecord("twilio", "assistantPhoneNumbers")).toEqual({
      "asst-alpha": "+15550002222",
      "asst-beta": "+15550003333",
    });
  });

  test("strips non-string values from record", () => {
    writeConfig_v2({
      twilio: {
        assistantPhoneNumbers: {
          "asst-alpha": "+15550002222",
          "asst-beta": 42,
          "asst-gamma": null,
        },
      },
    });
    const cache = new ConfigFileCache();
    expect(cache.getRecord("twilio", "assistantPhoneNumbers")).toEqual({
      "asst-alpha": "+15550002222",
    });
  });

  test("strips whitespace-only string values", () => {
    writeConfig_v2({
      twilio: {
        assistantPhoneNumbers: {
          "asst-alpha": "  ",
          "asst-beta": "+15550003333",
        },
      },
    });
    const cache = new ConfigFileCache();
    expect(cache.getRecord("twilio", "assistantPhoneNumbers")).toEqual({
      "asst-beta": "+15550003333",
    });
  });

  test("returns undefined for empty record after normalization", () => {
    writeConfig_v2({
      twilio: {
        assistantPhoneNumbers: {
          "asst-alpha": "",
          "asst-beta": 42,
        },
      },
    });
    const cache = new ConfigFileCache();
    expect(cache.getRecord("twilio", "assistantPhoneNumbers")).toBeUndefined();
  });

  test("returns undefined for array value", () => {
    writeConfig_v2({ twilio: { assistantPhoneNumbers: [1, 2, 3] } });
    const cache = new ConfigFileCache();
    expect(cache.getRecord("twilio", "assistantPhoneNumbers")).toBeUndefined();
  });

  test("returns undefined for non-object value", () => {
    writeConfig_v2({ twilio: { assistantPhoneNumbers: "not-an-object" } });
    const cache = new ConfigFileCache();
    expect(cache.getRecord("twilio", "assistantPhoneNumbers")).toBeUndefined();
  });

  test("returns undefined for missing section", () => {
    writeConfig_v2({});
    const cache = new ConfigFileCache();
    expect(cache.getRecord("twilio", "assistantPhoneNumbers")).toBeUndefined();
  });
});

describe("ConfigFileCache: TTL caching", () => {
  test("reads are cached within TTL", () => {
    writeConfig_v2({ email: { address: "first@test.com" } });
    const cache = new ConfigFileCache({ ttlMs: 60_000 });

    expect(cache.getString("email", "address")).toBe("first@test.com");

    // Update file, but TTL has not expired
    writeConfig_v2({ email: { address: "second@test.com" } });
    expect(cache.getString("email", "address")).toBe("first@test.com");
  });

  test("reads refresh after TTL expires", () => {
    writeConfig_v2({ email: { address: "first@test.com" } });
    // Use ttlMs: 0 so every read is fresh
    const cache = new ConfigFileCache({ ttlMs: 0 });

    expect(cache.getString("email", "address")).toBe("first@test.com");

    writeConfig_v2({ email: { address: "second@test.com" } });
    expect(cache.getString("email", "address")).toBe("second@test.com");
  });
});

describe("ConfigFileCache: force option", () => {
  test("force: true bypasses TTL", () => {
    writeConfig_v2({ email: { address: "first@test.com" } });
    const cache = new ConfigFileCache({ ttlMs: 60_000 });

    expect(cache.getString("email", "address")).toBe("first@test.com");

    writeConfig_v2({ email: { address: "second@test.com" } });

    // Without force, still cached
    expect(cache.getString("email", "address")).toBe("first@test.com");

    // With force, re-reads file
    expect(cache.getString("email", "address", { force: true })).toBe(
      "second@test.com",
    );
  });

  test("force works on getNumber", () => {
    writeConfig_v2({ limits: { max: 1 } });
    const cache = new ConfigFileCache({ ttlMs: 60_000 });

    expect(cache.getNumber("limits", "max")).toBe(1);
    writeConfig_v2({ limits: { max: 99 } });
    expect(cache.getNumber("limits", "max")).toBe(1);
    expect(cache.getNumber("limits", "max", { force: true })).toBe(99);
  });

  test("force works on getBoolean", () => {
    writeConfig_v2({ flags: { enabled: true } });
    const cache = new ConfigFileCache({ ttlMs: 60_000 });

    expect(cache.getBoolean("flags", "enabled")).toBe(true);
    writeConfig_v2({ flags: { enabled: false } });
    expect(cache.getBoolean("flags", "enabled")).toBe(true);
    expect(cache.getBoolean("flags", "enabled", { force: true })).toBe(false);
  });

  test("force works on getRecord", () => {
    writeConfig_v2({ twilio: { phones: { a: "+1" } } });
    const cache = new ConfigFileCache({ ttlMs: 60_000 });

    expect(cache.getRecord("twilio", "phones")).toEqual({ a: "+1" });
    writeConfig_v2({ twilio: { phones: { b: "+2" } } });
    expect(cache.getRecord("twilio", "phones")).toEqual({ a: "+1" });
    expect(cache.getRecord("twilio", "phones", { force: true })).toEqual({
      b: "+2",
    });
  });
});

describe("ConfigFileCache: refreshNow", () => {
  test("refreshNow immediately updates the cached snapshot", () => {
    writeConfig_v2({ email: { address: "first@test.com" } });
    const cache = new ConfigFileCache({ ttlMs: 60_000 });

    expect(cache.getString("email", "address")).toBe("first@test.com");

    writeConfig_v2({ email: { address: "second@test.com" } });

    // Still cached
    expect(cache.getString("email", "address")).toBe("first@test.com");

    cache.refreshNow();

    // Now returns fresh value
    expect(cache.getString("email", "address")).toBe("second@test.com");
  });

  test("refreshNow resets TTL so subsequent reads use the new snapshot", () => {
    writeConfig_v2({ email: { address: "v1" } });
    const cache = new ConfigFileCache({ ttlMs: 60_000 });

    cache.refreshNow();
    expect(cache.getString("email", "address")).toBe("v1");

    // Write again but TTL is not expired
    writeConfig_v2({ email: { address: "v2" } });
    expect(cache.getString("email", "address")).toBe("v1");
  });
});

describe("ConfigFileCache: invalidate", () => {
  test("invalidate marks cache as stale so next read re-reads", () => {
    writeConfig_v2({ email: { address: "first@test.com" } });
    const cache = new ConfigFileCache({ ttlMs: 60_000 });

    expect(cache.getString("email", "address")).toBe("first@test.com");

    writeConfig_v2({ email: { address: "second@test.com" } });
    cache.invalidate();

    expect(cache.getString("email", "address")).toBe("second@test.com");
  });

  test("invalidate fires onInvalidate callbacks", () => {
    const cache = new ConfigFileCache();
    const calls: string[] = [];
    cache.onInvalidate(() => calls.push("cb1"));
    cache.onInvalidate(() => calls.push("cb2"));

    cache.invalidate();
    expect(calls).toEqual(["cb1", "cb2"]);
  });

  test("onInvalidate returns unsubscribe function", () => {
    const cache = new ConfigFileCache();
    const calls: string[] = [];
    const unsub = cache.onInvalidate(() => calls.push("cb1"));
    cache.onInvalidate(() => calls.push("cb2"));

    unsub();
    cache.invalidate();
    expect(calls).toEqual(["cb2"]);
  });
});

describe("ConfigFileCache: missing config file", () => {
  test("returns undefined for all getters when file does not exist", () => {
    // Do not write any config file
    const cache = new ConfigFileCache();
    expect(cache.getString("email", "address")).toBeUndefined();
    expect(cache.getNumber("limits", "max")).toBeUndefined();
    expect(cache.getBoolean("flags", "enabled")).toBeUndefined();
    expect(cache.getRecord("twilio", "phones")).toBeUndefined();
  });

  test("recovers when config file is created after cache construction", () => {
    const cache = new ConfigFileCache({ ttlMs: 0 });
    expect(cache.getString("email", "address")).toBeUndefined();

    writeConfig_v2({ email: { address: "new@test.com" } });
    expect(cache.getString("email", "address")).toBe("new@test.com");
  });

  test("handles file deletion gracefully", () => {
    writeConfig_v2({ email: { address: "exists@test.com" } });
    const cache = new ConfigFileCache({ ttlMs: 0 });
    expect(cache.getString("email", "address")).toBe("exists@test.com");

    unlinkSync(configPath);
    expect(cache.getString("email", "address")).toBeUndefined();
  });
});

describe("ConfigFileCache: malformed config file", () => {
  test("returns empty snapshot for invalid JSON", () => {
    writeFileSync(configPath, "not valid json{{{");
    const cache = new ConfigFileCache();
    expect(cache.getString("email", "address")).toBeUndefined();
  });

  test("returns empty snapshot for array at root", () => {
    writeFileSync(configPath, "[1, 2, 3]");
    const cache = new ConfigFileCache();
    expect(cache.getString("email", "address")).toBeUndefined();
  });

  test("returns empty snapshot for null at root", () => {
    writeFileSync(configPath, "null");
    const cache = new ConfigFileCache();
    expect(cache.getString("email", "address")).toBeUndefined();
  });
});

describe("ConfigFileCache: section is non-object", () => {
  test("returns undefined when section is a string", () => {
    writeConfig_v2({ email: "not-an-object" });
    const cache = new ConfigFileCache();
    expect(cache.getString("email", "address")).toBeUndefined();
  });

  test("returns undefined when section is an array", () => {
    writeConfig_v2({ email: [1, 2, 3] });
    const cache = new ConfigFileCache();
    expect(cache.getString("email", "address")).toBeUndefined();
  });

  test("returns undefined when section is null", () => {
    writeConfig_v2({ email: null });
    const cache = new ConfigFileCache();
    expect(cache.getString("email", "address")).toBeUndefined();
  });
});
