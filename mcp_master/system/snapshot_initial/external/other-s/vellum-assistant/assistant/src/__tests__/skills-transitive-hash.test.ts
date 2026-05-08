import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "bun:test";

import type { SkillSummary } from "../config/skills.js";
import { indexCatalogById } from "../skills/include-graph.js";
import {
  computeTransitiveSkillVersionHash,
  TransitiveHashError,
} from "../skills/transitive-version-hash.js";

const testDirs: string[] = [];

function makeTempDir_v2(): string {
  const dir = mkdtempSync(join(tmpdir(), "transitive-hash-test-"));
  testDirs.push(dir);
  return dir;
}

/** Create a minimal SkillSummary with just the fields we need. */
function makeSkill_v2(
  id: string,
  directoryPath: string,
  includes?: string[],
): SkillSummary {
  return {
    id,
    name: id,
    displayName: id,
    description: `Test skill ${id}`,
    directoryPath,
    skillFilePath: join(directoryPath, "SKILL.md"),
    source: "managed",
    includes,
  };
}

afterEach(() => {
  for (const dir of testDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe("computeTransitiveSkillVersionHash", () => {
  test("returns a tv1: prefixed sha256 hash for a single skill", () => {
    const dir = makeTempDir_v2();
    writeFileSync(join(dir, "SKILL.md"), "# Root Skill\n");

    const catalog = [makeSkill_v2("root", dir)];
    const index = indexCatalogById(catalog);

    const hash = computeTransitiveSkillVersionHash("root", index);
    expect(hash).toMatch(/^tv1:[0-9a-f]{64}$/);
  });

  test("is deterministic for same content", () => {
    const dir = makeTempDir_v2();
    writeFileSync(join(dir, "SKILL.md"), "# Root Skill\n");

    const catalog = [makeSkill_v2("root", dir)];
    const index = indexCatalogById(catalog);

    const hash1 = computeTransitiveSkillVersionHash("root", index);
    const hash2 = computeTransitiveSkillVersionHash("root", index);
    expect(hash1).toBe(hash2);
  });

  test("is stable across separate index builds with unchanged content", () => {
    const dir = makeTempDir_v2();
    writeFileSync(join(dir, "SKILL.md"), "# Root Skill\n");

    const catalog1 = [makeSkill_v2("root", dir)];
    const index1 = indexCatalogById(catalog1);
    const hash1 = computeTransitiveSkillVersionHash("root", index1);

    // Build a fresh catalog and index from the same directory
    const catalog2 = [makeSkill_v2("root", dir)];
    const index2 = indexCatalogById(catalog2);
    const hash2 = computeTransitiveSkillVersionHash("root", index2);

    expect(hash1).toBe(hash2);
  });

  test("changes when root skill content changes", () => {
    const dir = makeTempDir_v2();
    writeFileSync(join(dir, "SKILL.md"), "# Root v1\n");

    const catalog = [makeSkill_v2("root", dir)];
    const index = indexCatalogById(catalog);
    const hash1 = computeTransitiveSkillVersionHash("root", index);

    writeFileSync(join(dir, "SKILL.md"), "# Root v2\n");
    const hash2 = computeTransitiveSkillVersionHash("root", index);

    expect(hash1).not.toBe(hash2);
  });

  test("changes when an included child skill content changes", () => {
    const rootDir = makeTempDir_v2();
    const childDir = makeTempDir_v2();
    writeFileSync(join(rootDir, "SKILL.md"), "# Root\n");
    writeFileSync(join(childDir, "SKILL.md"), "# Child v1\n");

    const catalog = [
      makeSkill_v2("root", rootDir, ["child"]),
      makeSkill_v2("child", childDir),
    ];
    const index = indexCatalogById(catalog);

    const hash1 = computeTransitiveSkillVersionHash("root", index);

    // Modify child
    writeFileSync(join(childDir, "SKILL.md"), "# Child v2\n");
    const hash2 = computeTransitiveSkillVersionHash("root", index);

    expect(hash1).not.toBe(hash2);
  });

  test("changes when a deeply nested child skill changes", () => {
    const rootDir = makeTempDir_v2();
    const childDir = makeTempDir_v2();
    const grandchildDir = makeTempDir_v2();
    writeFileSync(join(rootDir, "SKILL.md"), "# Root\n");
    writeFileSync(join(childDir, "SKILL.md"), "# Child\n");
    writeFileSync(join(grandchildDir, "SKILL.md"), "# Grandchild v1\n");

    const catalog = [
      makeSkill_v2("root", rootDir, ["child"]),
      makeSkill_v2("child", childDir, ["grandchild"]),
      makeSkill_v2("grandchild", grandchildDir),
    ];
    const index = indexCatalogById(catalog);

    const hash1 = computeTransitiveSkillVersionHash("root", index);

    writeFileSync(join(grandchildDir, "SKILL.md"), "# Grandchild v2\n");
    const hash2 = computeTransitiveSkillVersionHash("root", index);

    expect(hash1).not.toBe(hash2);
  });

  test("includes all children in a diamond dependency graph", () => {
    const rootDir = makeTempDir_v2();
    const leftDir = makeTempDir_v2();
    const rightDir = makeTempDir_v2();
    const bottomDir = makeTempDir_v2();
    writeFileSync(join(rootDir, "SKILL.md"), "# Root\n");
    writeFileSync(join(leftDir, "SKILL.md"), "# Left\n");
    writeFileSync(join(rightDir, "SKILL.md"), "# Right\n");
    writeFileSync(join(bottomDir, "SKILL.md"), "# Bottom v1\n");

    // Diamond: root -> [left, right], left -> [bottom], right -> [bottom]
    const catalog = [
      makeSkill_v2("root", rootDir, ["left", "right"]),
      makeSkill_v2("left", leftDir, ["bottom"]),
      makeSkill_v2("right", rightDir, ["bottom"]),
      makeSkill_v2("bottom", bottomDir),
    ];
    const index = indexCatalogById(catalog);

    const hash1 = computeTransitiveSkillVersionHash("root", index);

    // Changing the shared bottom skill must change the root's transitive hash
    writeFileSync(join(bottomDir, "SKILL.md"), "# Bottom v2\n");
    const hash2 = computeTransitiveSkillVersionHash("root", index);

    expect(hash1).not.toBe(hash2);
  });

  test("throws TransitiveHashError with code 'missing' for missing child", () => {
    const rootDir = makeTempDir_v2();
    writeFileSync(join(rootDir, "SKILL.md"), "# Root\n");

    // Root references "missing-child" which is not in the catalog
    const catalog = [makeSkill_v2("root", rootDir, ["missing-child"])];
    const index = indexCatalogById(catalog);

    expect(() => computeTransitiveSkillVersionHash("root", index)).toThrow(
      TransitiveHashError,
    );

    try {
      computeTransitiveSkillVersionHash("root", index);
    } catch (err) {
      expect(err).toBeInstanceOf(TransitiveHashError);
      expect((err as TransitiveHashError).code).toBe("missing");
      expect((err as TransitiveHashError).message).toContain("missing-child");
    }
  });

  test("throws TransitiveHashError with code 'cycle' for cyclic includes", () => {
    const dirA = makeTempDir_v2();
    const dirB = makeTempDir_v2();
    writeFileSync(join(dirA, "SKILL.md"), "# A\n");
    writeFileSync(join(dirB, "SKILL.md"), "# B\n");

    // Cycle: a -> b -> a
    const catalog = [makeSkill_v2("a", dirA, ["b"]), makeSkill_v2("b", dirB, ["a"])];
    const index = indexCatalogById(catalog);

    expect(() => computeTransitiveSkillVersionHash("a", index)).toThrow(
      TransitiveHashError,
    );

    try {
      computeTransitiveSkillVersionHash("a", index);
    } catch (err) {
      expect(err).toBeInstanceOf(TransitiveHashError);
      expect((err as TransitiveHashError).code).toBe("cycle");
    }
  });

  test("throws for a self-referencing cycle", () => {
    const dir = makeTempDir_v2();
    writeFileSync(join(dir, "SKILL.md"), "# Self\n");

    const catalog = [makeSkill_v2("self-ref", dir, ["self-ref"])];
    const index = indexCatalogById(catalog);

    expect(() => computeTransitiveSkillVersionHash("self-ref", index)).toThrow(
      TransitiveHashError,
    );

    try {
      computeTransitiveSkillVersionHash("self-ref", index);
    } catch (err) {
      expect((err as TransitiveHashError).code).toBe("cycle");
    }
  });

  test("throws for missing deeply nested child", () => {
    const rootDir = makeTempDir_v2();
    const childDir = makeTempDir_v2();
    writeFileSync(join(rootDir, "SKILL.md"), "# Root\n");
    writeFileSync(join(childDir, "SKILL.md"), "# Child\n");

    // child references "ghost" which doesn't exist
    const catalog = [
      makeSkill_v2("root", rootDir, ["child"]),
      makeSkill_v2("child", childDir, ["ghost"]),
    ];
    const index = indexCatalogById(catalog);

    expect(() => computeTransitiveSkillVersionHash("root", index)).toThrow(
      TransitiveHashError,
    );

    try {
      computeTransitiveSkillVersionHash("root", index);
    } catch (err) {
      expect((err as TransitiveHashError).code).toBe("missing");
      expect((err as TransitiveHashError).message).toContain("ghost");
    }
  });

  test("skill with no includes behaves like a leaf", () => {
    const dir = makeTempDir_v2();
    writeFileSync(join(dir, "SKILL.md"), "# Leaf Skill\n");

    const catalog = [makeSkill_v2("leaf", dir)];
    const index = indexCatalogById(catalog);

    // Should succeed with no errors
    const hash = computeTransitiveSkillVersionHash("leaf", index);
    expect(hash).toMatch(/^tv1:[0-9a-f]{64}$/);
  });

  test("skill with empty includes array behaves like a leaf", () => {
    const dir = makeTempDir_v2();
    writeFileSync(join(dir, "SKILL.md"), "# Leaf Skill\n");

    const catalog = [makeSkill_v2("leaf", dir, [])];
    const index = indexCatalogById(catalog);

    const hash = computeTransitiveSkillVersionHash("leaf", index);
    expect(hash).toMatch(/^tv1:[0-9a-f]{64}$/);
  });

  test("adding a new file to a child changes the parent transitive hash", () => {
    const rootDir = makeTempDir_v2();
    const childDir = makeTempDir_v2();
    writeFileSync(join(rootDir, "SKILL.md"), "# Root\n");
    writeFileSync(join(childDir, "SKILL.md"), "# Child\n");

    const catalog = [
      makeSkill_v2("root", rootDir, ["child"]),
      makeSkill_v2("child", childDir),
    ];
    const index = indexCatalogById(catalog);

    const hash1 = computeTransitiveSkillVersionHash("root", index);

    // Add a new file to child
    writeFileSync(join(childDir, "helper.ts"), "export {};");
    const hash2 = computeTransitiveSkillVersionHash("root", index);

    expect(hash1).not.toBe(hash2);
  });

  test("different include orderings produce different hashes", () => {
    // The include graph structure is encoded by the DFS visit order,
    // so different graphs must produce different hashes.
    const rootDir1 = makeTempDir_v2();
    const rootDir2 = makeTempDir_v2();
    const childADir = makeTempDir_v2();
    const childBDir = makeTempDir_v2();
    writeFileSync(join(rootDir1, "SKILL.md"), "# Root\n");
    writeFileSync(join(rootDir2, "SKILL.md"), "# Root\n");
    writeFileSync(join(childADir, "SKILL.md"), "# A\n");
    writeFileSync(join(childBDir, "SKILL.md"), "# B\n");

    // Graph 1: root includes only A
    const catalog1 = [
      makeSkill_v2("root", rootDir1, ["a"]),
      makeSkill_v2("a", childADir),
      makeSkill_v2("b", childBDir),
    ];
    const index1 = indexCatalogById(catalog1);
    const hash1 = computeTransitiveSkillVersionHash("root", index1);

    // Graph 2: root includes A and B
    const catalog2 = [
      makeSkill_v2("root", rootDir2, ["a", "b"]),
      makeSkill_v2("a", childADir),
      makeSkill_v2("b", childBDir),
    ];
    const index2 = indexCatalogById(catalog2);
    const hash2 = computeTransitiveSkillVersionHash("root", index2);

    expect(hash1).not.toBe(hash2);
  });
});
