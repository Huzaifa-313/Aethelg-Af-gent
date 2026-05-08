/**
 * Provider and model identifiers for cross-language compatibility.
 */

/** Provider ID */
export class ProviderId {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  static new(id: string): ProviderId {
    return new ProviderId(id);
  }

  // Well-known provider constants
  static readonly ANTHROPIC = 'anthropic';
  static readonly OPENAI = 'openai';
  static readonly GOOGLE = 'google';
  static readonly GOOGLE_VERTEX = 'google-vertex';
  static readonly AMAZON_BEDROCK = 'amazon-bedrock';
  static readonly AZURE = 'azure';
  static readonly GITHUB_COPILOT = 'github-copilot';
  static readonly MISTRAL = 'mistral';
  static readonly XAI = 'xai';
  static readonly GROQ = 'groq';
  static readonly DEEPINFRA = 'deepinfra';
  static readonly CEREBRAS = 'cerebras';
  static readonly COHERE = 'cohere';
  static readonly TOGETHER_AI = 'together-ai';
  static readonly PERPLEXITY = 'perplexity';
  static readonly OPENROUTER = 'openrouter';
  static readonly OLLAMA = 'ollama';
  static readonly LM_STUDIO = 'lm-studio';
  static readonly LLAMA_CPP = 'llama-cpp';
  static readonly DEEPSEEK = 'deepseek';
  static readonly GITLAB = 'gitlab';
  static readonly CLOUDFLARE = 'cloudflare';
  static readonly VENICE = 'venice';
  static readonly SAP = 'sap';
  static readonly SAMBANOVA = 'sambanova';
  static readonly HUGGINGFACE = 'huggingface';
  static readonly NVIDIA = 'nvidia';
  static readonly SILICONFLOW = 'siliconflow';
  static readonly MOONSHOT = 'moonshotai';
  static readonly ZHIPU = 'zhipuai';
  static readonly NEBIUS = 'nebius';
  static readonly OVHCLOUD = 'ovhcloud';
  static readonly SCALEWAY = 'scaleway';
  static readonly VULTR = 'vultr';
  static readonly BASETEN = 'baseten';
  static readonly FRIENDLI = 'friendli';
  static readonly UPSTAGE = 'upstage';
  static readonly STEPFUN = 'stepfun';
  static readonly FIREWORKS = 'fireworks';
  static readonly NOVITA = 'novita';

  asStr(): string {
    return this.id;
  }

  toString(): string {
    return this.id;
  }
}

/** Model ID */
export class ModelId {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  static new(id: string): ModelId {
    return new ModelId(id);
  }

  asStr(): string {
    return this.id;
  }

  toString(): string {
    return this.id;
  }
}