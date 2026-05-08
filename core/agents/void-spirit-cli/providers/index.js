# MERGED FROM: mythos/Void-spirit-CLI-main
# DATE: 2026-05-08T06:36:06.584Z

import { OpenAICompatProvider } from './openai-compat.js';
import { AnthropicProvider } from './anthropic.js';

export function createProvider(config) {
  const { providerType, apiKey, baseURL, model } = config;

  if (providerType === 'anthropic') {
    return new AnthropicProvider({ apiKey, model });
  }

  // Default: openai-compat (covers OpenAI, Gemini, Ollama, Groq, DeepSeek, Together, custom)
  return new OpenAICompatProvider({ apiKey, baseURL, model });
}
