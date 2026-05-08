/**
 * Model ID wrapper for cross-language compatibility.
 */

export class ModelId {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  static claudeSonnet4_5(): ModelId {
    return new ModelId('claude-sonnet-4-5');
  }

  static claudeOpus4_6(): ModelId {
    return new ModelId('claude-opus-4-6');
  }

  static claudeHaiku4_5(): ModelId {
    return new ModelId('claude-haiku-4-5-20251001');
  }

  static fromAlias(alias: string): ModelId {
    switch (alias) {
      case 'sonnet': return ModelId.claudeSonnet4_5();
      case 'opus': return ModelId.claudeOpus4_6();
      case 'haiku': return ModelId.claudeHaiku4_5();
      default: return new ModelId(alias);
    }
  }

  asStr(): string {
    return this.id;
  }

  toString(): string {
    return this.id;
  }
}