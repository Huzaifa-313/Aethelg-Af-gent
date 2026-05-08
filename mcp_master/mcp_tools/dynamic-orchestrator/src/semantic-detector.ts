/**
 * SemanticDetector - Analyzes user intent to identify required tool groups
 * RULE 6: Semantic detection ensures proper tool-group mapping
 */

import type { ToolGroup, SemanticConcept, DetectionResult } from './types.js';

export class SemanticDetector {
  private readonly semanticIndex: Map<string, string[]>; // concept -> [toolNames]
  private readonly toolConcepts: Map<string, Set<string>>; // toolName -> Set<concepts>
  private readonly groups: Map<string, ToolGroup>;

  constructor() {
    this.semanticIndex = new Map();
    this.toolConcepts = new Map();
    this.groups = this.initializeGroups();
    this.buildSemanticIndex();
  }

  /**
   * Initialize 21 semantic groups with keywords, priorities, and min/max counts
   */
  private initializeGroups(): Map<string, ToolGroup> {
    const groups: ToolGroup[] = [
      // ========================================
      // TIER 1: Core Foundation (always on)
      // ========================================
      {
        name: "core_foundation",
        priority: 10,
        triggerKeywords: ["read", "write", "edit", "create", "delete", "file", "directory"],
        autoEnable: true,
        alwaysOn: true,
        minCount: 8,
        tools: [
          "sequential-thinking", "memory", "filesystem",
          "read", "write", "edit", "create", "delete"
        ]
      },

      // ========================================
      // TIER 2: Execution & Code Management
      // ========================================
      {
        name: "execution",
        priority: 9,
        triggerKeywords: ["run", "execute", "command", "shell", "terminal", "script", "start", "process"],
        autoEnable: true,
        minCount: 3,
        maxCount: 5,
        tools: ["bash", "shell", "execute", "run", "spawn"]
      },
      {
        name: "version_control",
        priority: 8,
        triggerKeywords: ["git", "commit", "push", "pull", "branch", "repo", "repository", "merge", "clone"],
        autoEnable: true,
        minCount: 3,
        maxCount: 6,
        tools: ["git-status", "git-diff", "git-commit", "git-push", "git-pull", "git", "github"]
      },
      {
        name: "code_search",
        priority: 7,
        triggerKeywords: ["search", "find", "locate", "query", "pattern", "grep", "locate", "scan"],
        autoEnable: true,
        minCount: 2,
        maxCount: 4,
        tools: ["grep", "glob", "search", "find", "ack", "ripgrep"]
      },

      // ========================================
      // TIER 3: Development Workflow
      // ========================================
      {
        name: "testing",
        priority: 7,
        triggerKeywords: ["test", "spec", "assert", "verify", "unit test", "e2e", "integration", "qa"],
        autoEnable: true,
        minCount: 2,
        maxCount: 5,
        tools: ["test", "jest", "mocha", "vitest", "tap", "ava"]
      },
      {
        name: "package_management",
        priority: 8,
        triggerKeywords: ["npm", "install", "package", "dependency", "module", "library", "yarn", "pnpm"],
        autoEnable: true,
        minCount: 2,
        maxCount: 4,
        tools: ["npm", "yarn", "pnpm", "install", "package"]
      },
      {
        name: "build_compile",
        priority: 6,
        triggerKeywords: ["build", "compile", "bundle", "deploy", "production", "webpack", "vite"],
        autoEnable: true,
        minCount: 2,
        maxCount: 4,
        tools: ["build", "compile", "webpack", "vite", "rollup", "esbuild"]
      },

      // ========================================
      // TIER 4: External Integration
      // ========================================
      {
        name: "web_network",
        priority: 8,
        triggerKeywords: ["http", "web", "url", "api", "fetch", "request", "search", "research", "online"],
        autoEnable: true,
        minCount: 2,
        maxCount: 5,
        tools: ["fetch", "http-get", "http-post", "curl", "tavily", "brave-search", "duckduckgo"]
      },
      {
        name: "browser_automation",
        priority: 8,
        triggerKeywords: ["browser", "screenshot", "scrape", "automate", "click", "navigate", "puppeteer", "playwright"],
        autoEnable: true,
        minCount: 1,
        maxCount: 3,
        tools: ["puppeteer", "playwright", "browserbase"]
      },
      {
        name: "database",
        priority: 7,
        triggerKeywords: ["database", "query", "sql", "db", "store", "record", "collection", "table"],
        autoEnable: true,
        minCount: 1,
        maxCount: 3,
        tools: ["sqlite", "mysql", "postgres", "mongodb", "redis"]
      },
      {
        name: "collaboration",
        priority: 6,
        triggerKeywords: ["github", "gitlab", "linear", "slack", "discord", "issue", "pr", "collaborate"],
        autoEnable: true,
        minCount: 1,
        maxCount: 3,
        tools: ["github", "gitlab", "slack", "linear"]
      },

      // ========================================
      // TIER 5: Data & Intelligence
      // ========================================
      {
        name: "ai_agents",
        priority: 10,
        triggerKeywords: ["agent", "swarm", "ai", "automate", "orchestrate", "multi-agent", "distributed"],
        autoEnable: true,
        minCount: 1,
        maxCount: 3,
        tools: ["ruflo", "agent-spawn", "swarm-coordinate"]
      },
      {
        name: "vector_search",
        priority: 6,
        triggerKeywords: ["vector", "embedding", "semantic", "similarity", "memory", "neural"],
        autoEnable: false,
        minCount: 0,
        maxCount: 3,
        tools: ["qdrant", "milvus", "neo4j"]
      },
      {
        name: "data_transform",
        priority: 5,
        triggerKeywords: ["parse", "format", "convert", "transform", "json", "yaml", "csv", "serialize"],
        autoEnable: true,
        minCount: 2,
        maxCount: 5,
        tools: ["json-parse", "json-stringify", "yaml", "csv", "transform"]
      },

      // ========================================
      // TIER 6: System & Security
      // ========================================
      {
        name: "security",
        priority: 7,
        triggerKeywords: ["security", "encrypt", "hash", "sign", "token", "auth", "jwt", "certificate"],
        autoEnable: true,
        minCount: 2,
        maxCount: 4,
        tools: ["hash", "encrypt", "decrypt", "sign", "verify", "jwt"]
      },
      {
        name: "system_utils",
        priority: 6,
        triggerKeywords: ["system", "env", "config", "process", "monitor", "ps", "kill", "performance"],
        autoEnable: true,
        minCount: 3,
        maxCount: 6,
        tools: ["env", "config", "settings", "path", "ps", "kill", "log", "debug"]
      },
      {
        name: "utilities",
        priority: 4,
        triggerKeywords: ["date", "math", "random", "validate", "compress", "encode", "uuid"],
        autoEnable: true,
        minCount: 2,
        maxCount: 10,
        tools: ["date", "calculate", "format", "filter", "random", "validate", "compress", "encode"]
      },

      // ========================================
      // TIER 7: Cloud & Monitoring
      // ========================================
      {
        name: "cloud_devops",
        priority: 5,
        triggerKeywords: ["deploy", "docker", "kubernetes", "cloud", "infrastructure", "aws", "terraform"],
        autoEnable: false,
        minCount: 0,
        maxCount: 5,
        tools: ["docker", "kubernetes", "terraform", "aws-cli", "gcloud"]
      },
      {
        name: "monitoring",
        priority: 4,
        triggerKeywords: ["monitor", "metrics", "logs", "alert", "observability", "tracing"],
        autoEnable: false,
        minCount: 0,
        maxCount: 4,
        tools: ["metoro", "axiom", "prometheus", "grafana"]
      },
      {
        name: "knowledge_docs",
        priority: 3,
        triggerKeywords: ["notion", "docs", "wiki", "markdown", "document", "knowledge"],
        autoEnable: false,
        minCount: 0,
        maxCount: 3,
        tools: ["notion", "obsidian", "markdownify"]
      }
    ];

    const map = new Map<string, ToolGroup>();
    for (const group of groups) {
      map.set(group.name, group);
    }
    return map;
  }

  /**
   * Build semantic index - maps concepts to tools and vice versa
   * RULE 6: Semantic detection uses concept-tool mappings
   */
  private buildSemanticIndex(): void {
    const semanticMap: Record<string, string[]> = {
      // Core concepts
      'reasoning': ['sequential-thinking', 'memory'],
      'filesystem': ['filesystem', 'read', 'write', 'edit', 'create', 'delete'],

      // Execution & Development
      'execution': ['bash', 'shell', 'execute', 'run', 'spawn'],
      'version_control': ['git-status', 'git-diff', 'git-commit', 'git-push', 'git-pull', 'git', 'github'],
      'code_search': ['grep', 'glob', 'search', 'find', 'ack', 'ripgrep'],
      'testing': ['test', 'jest', 'mocha', 'vitest', 'tap', 'ava'],
      'package': ['npm', 'yarn', 'pnpm', 'install'],
      'build': ['build', 'compile', 'webpack', 'vite', 'rollup', 'esbuild'],

      // External Integration
      'web': ['fetch', 'http-get', 'http-post', 'curl', 'tavily', 'brave-search', 'duckduckgo'],
      'browser': ['puppeteer', 'playwright', 'browserbase'],
      'database': ['sqlite', 'mysql', 'postgres', 'mongodb', 'redis'],
      'collaboration': ['github', 'gitlab', 'slack', 'linear'],

      // AI & Data
      'ai': ['ruflo', 'agent-spawn', 'swarm-coordinate'],
      'vector': ['qdrant', 'milvus', 'neo4j'],
      'data': ['json-parse', 'json-stringify', 'yaml', 'csv', 'transform'],

      // System & Security
      'security': ['hash', 'encrypt', 'decrypt', 'sign', 'verify', 'jwt'],
      'system': ['env', 'config', 'settings', 'path', 'ps', 'kill', 'log', 'debug'],
      'utility': ['date', 'calculate', 'format', 'filter', 'random', 'validate', 'compress', 'encode'],

      // Cloud & Monitoring
      'cloud': ['docker', 'kubernetes', 'terraform', 'aws-cli', 'gcloud'],
      'monitoring': ['metoro', 'axiom', 'prometheus', 'grafana'],
      'knowledge': ['notion', 'obsidian', 'markdownify']
    };

    // Build reverse index: concept -> tools
    for (const [concept, tools] of Object.entries(semanticMap)) {
      this.semanticIndex.set(concept, tools);
    }

    // Build forward index: tool -> concepts
    for (const [concept, tools] of Object.entries(semanticMap)) {
      for (const tool of tools) {
        if (!this.toolConcepts.has(tool)) {
          this.toolConcepts.set(tool, new Set());
        }
        this.toolConcepts.get(tool)!.add(concept);
      }
    }
  }

  /**
   * Analyze user input and return matched groups with scores
   * RULE 6: Semantic detection identifies required tool groups
   */
  analyzeInput(input: string): DetectionResult {
    const normalizedInput = input.toLowerCase();
    const matchedGroups: ToolGroup[] = [];
    const conceptMatches = new Map<string, number>();

    // Always include core foundation
    const coreGroup = this.groups.get("core_foundation");
    if (coreGroup) {
      matchedGroups.push({ ...coreGroup, priority: 10 });
    }

    // Score each group based on keyword matches
    for (const [_, group] of this.groups) {
      let score = 0;
      let matchedKeywords = 0;

      for (const keyword of group.triggerKeywords) {
        if (normalizedInput.includes(keyword.toLowerCase())) {
          matchedKeywords++;
          score += 2;
        }
      }

      // Boost score based on keyword match ratio
      if (group.triggerKeywords.length > 0) {
        const matchRatio = matchedKeywords / group.triggerKeywords.length;
        score += matchRatio * group.priority;
      }

      if (score > 0) {
        const enhancedGroup = {
          ...group,
          priority: group.priority + (score / 2)
        };
        matchedGroups.push(enhancedGroup);

        // Track concept matches
        conceptMatches.set(group.name, score);
      }
    }

    // Sort by priority (highest first)
    matchedGroups.sort((a, b) => b.priority - a.priority);

    // Calculate overall confidence
    const totalScore = Array.from(conceptMatches.values()).reduce((sum, s) => sum + s, 0);
    const confidence = matchedGroups.length > 0 ? Math.min(1, totalScore / (matchedGroups.length * 5)) : 0;

    return {
      matchedGroups,
      conceptMatches,
      toolScores: [],
      confidence
    };
  }

  /**
   * Calculate semantic similarity between input and a tool
   */
  calculateToolScore(
    toolName: string,
    detectedConcepts: Map<string, number>,
    usageHistory: Map<string, number[]>,
    basePriority: number
  ): { score: number; priority: number; demandLevel: number } {
    // Get semantic concepts for this tool
    const concepts = this.toolConcepts.get(toolName) || new Set();
    let semanticScore = 0;

    for (const concept of concepts) {
      semanticScore += detectedConcepts.get(concept) || 0;
    }

    // Calculate demand from recent usage
    const history = usageHistory.get(toolName);
    const now = Date.now();
    const recentWindow = 5 * 60 * 1000; // 5 minutes
    const recentCalls = history?.filter(t => now - t < recentWindow).length || 0;

    // Weighted scoring: 40% semantic, 60% demand
    const demandScore = recentCalls * 2;
    const finalScore = (semanticScore * 0.4) + (demandScore * 0.6);

    // Adjust priority based on core status and usage
    let adjustedPriority = basePriority;
    if (this.isCoreTool(toolName)) {
      adjustedPriority = Math.max(adjustedPriority, 10);
    }
    if (recentCalls > 10) {
      adjustedPriority += 1;
    }

    return {
      score: finalScore,
      priority: adjustedPriority,
      demandLevel: recentCalls
    };
  }

  /**
   * Get all tool groups
   */
  getGroups(): ToolGroup[] {
    return Array.from(this.groups.values());
  }

  /**
   * Get group by name
   */
  getGroup(name: string): ToolGroup | undefined {
    return this.groups.get(name);
  }

  /**
   * Check if a tool is core
   */
  isCoreTool(toolName: string): boolean {
    const coreGroup = this.groups.get("core_foundation");
    return coreGroup?.tools.includes(toolName) || false;
  }

  /**
   * Get all semantic concepts
   */
  getSemanticConcepts(): string[] {
    return Array.from(this.semanticIndex.keys());
  }

  /**
   * Get tools for a specific concept
   */
  getToolsForConcept(concept: string): string[] {
    return this.semanticIndex.get(concept) || [];
  }

  /**
   * Get all tools
   */
  getAllTools(): string[] {
    const allTools = new Set<string>();
    for (const [_, tools] of this.semanticIndex) {
      for (const tool of tools) {
        allTools.add(tool);
      }
    }
    return Array.from(allTools);
  }
}
