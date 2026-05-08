# Aethelgard Universal Provider Engine

A comprehensive, self-expanding LLM provider system that connects Aethelgard to 30+ LLM providers with intelligent routing, automatic proxy management, and self-evolution capabilities.

## 🎯 Overview

The provider engine is the universal LLM interface for Aethelgard, providing:

- **30+ Provider Integrations**: OpenAI, Anthropic, Google, Groq, Perplexity, Mistral, Together, DeepSeek, Cohere, Replicate, HuggingFace, NVIDIA, Zhipu, Qwen, Baichuan, Moonshot, Tencent, Yi, MiniMax, XVERSE, Ollama, Llama.cpp, vLLM, LocalAI, Fireworks, Anyscale, Lepton AI, RunPod, OpenRouter, and Custom Template.

- **Self-Evolution**: Providers automatically track performance, learn from failures, and adapt behavior.

- **Zero-Touch Proxy Management**: Automatic proxy detection, rotation, and setup for region-restricted providers.

- **Hunter-Driven Expansion**: GitHub hunter automatically discovers and integrates new provider implementations.

- **Security First**: Encrypted API key storage, safety scanning, and failure isolation.

## 📁 Package Structure

```
core/providers/
├── __init__.py              # Package exports
├── base.py                  # Abstract base class with self-evolution
├── registry.py              # Provider manager and registry
├── model_fetcher.py        # Live model list fetching and caching
├── proxy_manager.py        # Zero-touch proxy auto-setup
├── key_store.py            # Encrypted API key storage
├── config.yaml             # Master configuration (30+ providers)
├── README.md               # This file
├── test_base_provider.py   # Tests for base provider
├── test_registry.py       # Tests for registry
├── test_proxy_manager.py   # Tests for proxy manager
├── test_key_store.py      # Tests for key store
└── implementations/       # Concrete provider implementations
    ├── __init__.py
    ├── openai.py
    ├── anthropic.py
    ├── google.py
    ├── groq.py
    ├── perplexity.py
    ├── mistral.py
    ├── together.py
    ├── deepseek.py
    ├── cohere.py
    ├── replicate.py
    ├── huggingface.py
    ├── nvidia.py
    ├── zhipu.py
    ├── qwen.py
    ├── baichuan.py
    ├── moonshot.py
    ├── tencent.py
    ├── yi.py
    ├── minimax.py
    ├── xverse.py
    ├── ollama.py
    ├── llamacpp.py
    ├── vllm.py
    ├── localai.py
    ├── fireworks.py
    ├── anyscale.py
    ├── leptonai.py
    ├── runpod.py
    ├── openrouter.py
    └── custom_template.py
```

## 🚀 Quick Start

### 1. Basic Usage

```python
from core.providers.registry import ProviderManager

# Get the singleton instance
manager = ProviderManager()

# List all providers
providers = manager.list_providers()
print(f"Available providers: {providers}")

# List all models
all_models = manager.get_all_models()
print(f"Total models: {len(all_models)}")

# Chat with a provider
response = manager.chat(
    "openai/gpt-3.5-turbo",
    [{"role": "user", "content": "Hello!"}]
)
print(response)
```

### 2. Using the Orchestrator

```python
from core.orchestrator import AgentOrchestrator

# Initialize orchestrator (automatically loads provider registry)
orchestrator = AgentOrchestrator()

# Check provider status
status = orchestator.get_status()
print(f"Providers: {status.get('providers')}")

# List models for a specific provider
models = orchestator.list_models("openai")
print(f"OpenAI models: {models}")

# Create and execute a task using LLM
task = orchestator.create_task(
    "Explain quantum computing in simple terms",
    capability="llm"
)
result = orchestator.execute_task(task)
print(result)
```

## 🔧 Configuration

Edit `core/providers/config.yaml` to:

1. **Enable/disable providers**:
```yaml
providers:
  openai:
    enabled: true  # Set to false to disable
```

2. **Set API keys** (via environment variables):
```yaml
providers:
  openai:
    api_key_env: "OPENAI_API_KEY"  # Set in your environment
```

3. **Configure proxy requirements**:
```yaml
providers:
  zhipu:
    requires_proxy: true  # Enable for region-restricted providers
```

## 🔐 Adding a Custom Provider

1. Copy `core/providers/implementations/custom_template.py` to a new file (e.g., `my_provider.py`).

2. Rename the class and implement required methods:
```python
from core.providers.base import BaseProvider

class MyProvider(BaseProvider):
    def list_models(self):
        return ["my-model-1", "my-model-2"]
    
    def chat_completion(self, model, messages, **kwargs):
        # Your API call logic here
        pass
```

3. Add to `config.yaml`:
```yaml
providers:
  my_provider:
    name: "My Provider"
    class: "core.providers.implementations.my_provider.MyProvider"
    api_key_env: "MY_PROVIDER_API_KEY"
    endpoint: "https://api.my-provider.com/v1"
    requires_proxy: false
    enabled: true
```

## 🌐 Proxy Configuration

### Automatic Proxy Setup

The proxy manager automatically:
- Detects when a provider needs a proxy
- Searches for proxy configurations in `core/providers/proxy_list.yaml`
- Triggers the GitHub hunter to find new proxies if none are available
- Rotates proxies based on failure patterns

### Manual Proxy Configuration

Edit `core/providers/proxy_list.yaml`:
```yaml
proxies:
  default_http:
    protocol: http
    host: proxy.example.com
    port: 8080
    username: ""
    password: ""
  
  my_provider:
    protocol: socks5
    host: 127.0.0.1
    port: 1080
```

## 🧠 Self-Evolution Features

Providers automatically:
- **Track performance**: Success/failure counts, performance scores
- **Learn from failures**: Identify failure patterns and adapt
- **Temporary disable**: Automatically disable unreliable providers
- **Health checks**: Continuous monitoring of provider availability

Access provider statistics:
```python
provider = manager.get_provider("openai")
stats = provider.get_provider_stats()
print(stats)
# Output: {'name': 'openai', 'success_count': 10, ...}
```

## 🎯 GitHub Hunter Integration

The provider scout automatically:
1. Searches GitHub for new provider implementations
2. Analyzes repositories for provider code patterns
3. Extracts and adapts provider implementations
4. Runs safety checks on new code
5. Updates configuration and tests integration

Run a scouting mission:
```python
from core.hunter.provider_scout import ProviderScout

scout = ProviderScout()
result = scout.run_scouting_mission()
print(result)
```

## 🔒 Security Features

- **Encrypted API key storage**: Keys are encrypted using Fernet encryption
- **Safety scanning**: All hunter-downloaded code is scanned
- **Failure isolation**: Provider failures don't crash the system
- **Credential masking**: Proxy credentials are masked in logs

Manage API keys:
```python
from core.providers.key_store import ProviderKeyStore

store = ProviderKeyStore()

# Store a key (encrypted)
store.store_api_key("openai", "sk-...")

# Retrieve a key
key = store.get_api_key("openai", env_var="OPENAI_API_KEY")
```

## 🧪 Testing

Run the test suite:
```bash
# From the project root
pytest core/providers/test_*.py -v
```

Test coverage includes:
- Base provider functionality
- Provider registry operations
- Proxy manager features
- Key store encryption/decryption
- Self-evolution mechanics

## 📊 Performance & Monitoring

Monitor provider performance through the orchestrator:
```python
orchestrator = AgentOrchestrator()

# Get health status of all providers
health = orchestator.get_provider_health()
print(health)
# Output: {'openai': True, 'anthropic': True, ...}

# Get detailed status
status = orchestator.get_status()
print(status)
```

## 🔗 Integration with Aethelgard

The provider engine integrates with:
- **Orchestrator**: Automatic provider selection and task routing
- **Memory System**: Failure recording and learning
- **Hunter**: Self-expansion through GitHub discovery
- **Safety System**: Security scanning and quarantine

## 📝 Notes

- All provider API keys are read from environment variables by default
- The system gracefully falls back to cached model lists when APIs are unavailable
- China/Asia region providers are configured to use proxies by default
- Local providers (Ollama, Llama.cpp, etc.) are enabled by default for local development

## 🚀 Next Steps

1. Set up API keys in your environment
2. Enable the providers you want to use in `config.yaml`
3. Run a scouting mission to discover new providers
4. Monitor provider performance and let the system self-optimize

---

**Aethelgard Universal Provider Engine** - Speak to every major LLM on the planet, self-heal connections, and automatically find new ones. Truly universal and unstoppable.
