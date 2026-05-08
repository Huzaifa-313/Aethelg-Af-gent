# Plugin L2 Adapter Design

## Overview

The **Plugin L2 Adapter** framework allows third-party developers to extend
LMCache with custom L2 storage backends **without modifying any LMCache source
code**. A plugin is simply a Python module that implements `L2AdapterInterface`
and is loaded at runtime via the `PluginL2AdapterConfig` mechanism.

This is the recommended way to integrate external storage systems (e.g.
NitroFS, custom distributed caches) into LMCache's MP-mode L2 pipeline.

---

## Key Components

### `PluginL2AdapterConfig`

Config class registered under the type name `"plugin"`. Fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `module_path` | `str` | yes | Dotted Python import path of the module containing the adapter class. |
| `class_name` | `str` | yes | Name of the class inside `module_path` that implements `L2AdapterInterface`. |
| `adapter_params` | `dict` | no | Arbitrary keyword arguments forwarded to the adapter class constructor. |

Defined in `plugin_l2_adapter.py` and self-registered at import time via:
```python
register_l2_adapter_type("plugin", PluginL2AdapterConfig)
register_l2_adapter_factory("plugin", _create_plugin_adapter)
```

### `_create_plugin_adapter`

Factory function that:
1. Calls `importlib.import_module(config.module_path)` to load the user module.
2. Retrieves `config.class_name` from the module via `getattr`.
3. Validates it is a subclass of `L2AdapterInterface`.
4. Resolves a config class via `_resolve_config_class` (see below).
5. If a config class is found, builds a config instance via `from_dict()`
   and passes it to the adapter constructor (built-in convention).
   Otherwise falls back to passing the raw `adapter_params` dict.

### Config Class Auto-Discovery (`_resolve_config_class`)

The factory automatically resolves the adapter's config class using
the following priority chain (first match wins):

| Priority | Strategy | Example |
|---|---|---|
| 1 | Explicit `config_class_name` field in JSON config | `"config_class_name": "MyConfig"` |
| 2 | Convention: adapter class name + `"Config"` suffix | `MyL2Adapter` → looks for `MyL2AdapterConfig` |
| 3 | `config_class_name` attribute on the adapter class | `class MyAdapter: config_class_name = "MyConfig"` |
| 4 | No config class found — pass raw `adapter_params` dict | legacy / simple plugins |

Each candidate name is looked up in the loaded module and validated as
an `L2AdapterConfigBase` subclass.  Non-existent or invalid names are
silently skipped, moving to the next candidate.

This means most plugins that follow the naming convention (e.g.
`InMemoryL2Adapter` + `InMemoryL2AdapterConfig` in the same module)
will **automatically** receive a typed config instance without any
extra configuration.

---

## Loading Flow

```
CLI / config JSON
  │
  ▼
parse_args_to_l2_adapters_config()
  │  JSON: {"type": "plugin",
  │         "module_path": "my_plugin",
  │         "class_name": "MyL2Adapter",
  │         "adapter_params": {...}}
  │
  ▼
PluginL2AdapterConfig.from_dict(d)
  │  validates module_path, class_name, adapter_params
  │
  ▼
create_l2_adapter_from_registry(config, **kwargs)
  │  looks up factory for "plugin"
  │
  ▼
_create_plugin_adapter(config, ...)
  │
  ├─ importlib.import_module(config.module_path)
  ├─ getattr(module, config.class_name)
  ├─ issubclass check against L2AdapterInterface
  │
  ├─ _resolve_config_class(module, config, adapter_cls)
  │   ├─ 1. config.config_class_name (explicit)
  │   ├─ 2. class_name + "Config" (convention)
  │   ├─ 3. adapter_cls.config_class_name (attribute)
  │   └─ 4. None (fall back to raw dict)
  │
  ├─ [if config class found]
  │   └─ adapter_cls(cfg_cls.from_dict(adapter_params))
  │
  └─ [otherwise]
      └─ adapter_cls(adapter_params)
          │
          ▼
  L2AdapterInterface instance (ready for use)
```

---


## Plugin Contract

A plugin adapter class **must**:

1. **Subclass `L2AdapterInterface`** from `lmcache.v1.distributed.l2_adapters.base`.
2. **Implement all abstract methods**: store, lookup & lock, load, close,
   and all three event-fd getters.
3. **Provide three distinct event fds** (store / lookup / load). The
   controllers build `fd → adapter` maps; duplicates will misroute events.
4. **Be thread-safe**: the `StoreController` and `PrefetchController`
   call adapter methods from different threads concurrently.
5. **Accept `**kwargs` in `__init__`** to stay forward-compatible with new
   framework-level arguments.

A plugin adapter class **should**:

1. Create its own asyncio event loop and background thread if it needs
   async I/O (the framework does **not** provide a loop to L2 adapters,
   unlike the old Connector-based architecture).
2. Use `create_event_notifier()` from `lmcache.v1.platform` for the
   three event fds (cross-platform: `os.eventfd` on Linux,
   `os.pipe` fallback elsewhere).
3. Clean up all resources (event fds, threads, connections) in `close()`.

---

## Threading Model (Plugin Side)

Since the framework does **not** provide an event loop to L2 adapters
(unlike the old non-MP `ConnectorContext.loop`), plugins that need async
I/O must manage their own:

```
Plugin.__init__()
  ├─ self._loop = asyncio.new_event_loop()
  └─ self._thread = Thread(target=run_loop, daemon=True)

Caller threads (StoreController / PrefetchController)
  │
  ├─ submit_store_task()    → run_coroutine_threadsafe(...)
  ├─ submit_lookup_task()   → call_soon_threadsafe(...)
  └─ submit_load_task()     → run_coroutine_threadsafe(...)
  │
  ▼
Plugin background thread (event loop)
  │
  ├─ Executes store/load coroutines
  ├─ Writes to eventfd on completion
  └─ Accesses shared state under lock
```

This pattern is identical to the one used by `MockL2Adapter` and
`NixlStoreL2Adapter`.

---


## Example: Minimal Plugin

### 1. Implement the Adapter

```python
# my_plugin/adapter.py
import asyncio, threading
from lmcache.native_storage_ops import Bitmap
from lmcache.v1.distributed.l2_adapters.base import (
    L2AdapterInterface, L2TaskId,
)
from lmcache.v1.platform import create_event_notifier

class MyL2Adapter(L2AdapterInterface):
    def __init__(self, host="localhost", **_kw):
        self._store_efd = create_event_notifier()
        self._lookup_efd = create_event_notifier()
        self._load_efd = create_event_notifier()
        # ... set up connection to `host`, background thread, etc.

    # implement all abstract methods ...
```

### 2. Configure via JSON

```json
{
  "type": "plugin",
  "module_path": "my_plugin.adapter",
  "class_name": "MyL2Adapter",
  "adapter_params": {
    "host": "10.0.0.1"
  }
}
```

### 3. Launch

```bash
# via CLI
--l2-adapter '{"type":"plugin","module_path":"my_plugin.adapter","class_name":"MyL2Adapter","adapter_params":{"host":"10.0.0.1"}}'

# or via pytest (for testing)
cfg = PluginL2AdapterConfig.from_dict({...})
adapter = create_l2_adapter_from_registry(cfg)
```

---

## Reference Implementation

See `examples/lmc_external_l2_adapter/` for a complete, pip-installable
example plugin (`InMemoryL2Adapter`) that demonstrates:

- FIFO eviction with configurable capacity.
- Simulated bandwidth delay for realistic testing.
- Background asyncio event loop with proper shutdown.
- Full test suite covering store, lookup, load, batch operations,
  and eviction behavior.

---

## Native Plugin L2 Adapter (`native_plugin`)

The **Native Plugin** adapter type (`"native_plugin"`) enables loading
third-party **native connectors** (pybind-wrapped C++ or pure-Python
implementations of the `IStorageConnector` interface) without requiring
them to re-implement the Python-side demux/lock bridging logic.

### How It Differs from `plugin`

| Aspect | `plugin` | `native_plugin` |
|---|---|---|
| What is loaded | A full `L2AdapterInterface` subclass | A **connector** object (lower level) |
| Bridging logic | Provided by the plugin itself | Reused from `NativeConnectorL2Adapter` |
| Third-party effort | Must implement all abstract methods + 3 eventfds | Only 6 connector methods |

### `NativePluginL2AdapterConfig`

Config class registered under the type name `"native_plugin"`. Fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `module_path` | `str` | yes | Dotted Python import path of the module containing the connector class. |
| `class_name` | `str` | yes | Name of the connector class inside `module_path`. |
| `adapter_params` | `dict` | no | Forwarded as `**kwargs` to the connector class constructor. |

### Required Connector Interface

The dynamically loaded connector instance must expose the following
methods (identical to the pybind `LMCACHE_BIND_CONNECTOR_METHODS` contract):

```python
class NativeConnectorProtocol:
    def event_fd(self) -> int: ...
    def submit_batch_get(self, keys: list[str], memoryviews: list[memoryview]) -> int: ...
    def submit_batch_set(self, keys: list[str], memoryviews: list[memoryview]) -> int: ...
    def submit_batch_exists(self, keys: list[str]) -> int: ...
    def drain_completions(self) -> list[tuple[int, bool, str, list[bool] | None]]: ...
    def close(self) -> None: ...
```

The factory validates these methods at creation time and raises
`TypeError` if any are missing.

### Loading Flow

```
CLI / config JSON
  │
  ▼
parse_args_to_l2_adapters_config()
  │  JSON: {"type": "native_plugin",
  │         "module_path": "my_ext.connector",
  │         "class_name": "MyConnectorClient",
  │         "adapter_params": {"host": "localhost"}}
  │
  ▼
NativePluginL2AdapterConfig.from_dict(d)
  │
  ▼
_create_native_plugin_l2_adapter(config, ...)
  │
  ├─ importlib.import_module(config.module_path)
  ├─ getattr(module, config.class_name)
  ├─ connector_cls(**config.adapter_params)
  ├─ validate 6 required methods
  └─ NativeConnectorL2Adapter(native_client)
          │
          ▼
  L2AdapterInterface instance (ready for use)
```

### Example

```json
{
  "type": "native_plugin",
  "module_path": "lmc_external_native_connector",
  "class_name": "ExampleNativeConnector",
  "adapter_params": {
    "backend": "fs",
    "base_path": "/tmp/lmcache_ext",
    "num_workers": 2
  }
}
```

### Reference Implementation

See `examples/lmc_external_native_connector/` for a complete,
pip-installable example connector plugin that demonstrates:

- C++ pybind11-wrapped connectors inheriting from
  `ConnectorBase<T>` (same as built-in Redis/FS).
- Two backends: filesystem (ExampleFSConnector) and
  in-memory (ExampleMemoryConnector), both in C++.
- A thin Python factory class (`ExampleNativeConnector`)
  that selects the backend via a `"backend"` parameter.
- Worker thread pool with eventfd notification
  (inherited from `ConnectorBase`).
- Build via `pip install -e .` using pybind11 + setuptools.

---

## Self-Registration Mechanism

The `plugin_l2_adapter.py` and `native_connector_l2_adapter.py`
modules follow the same self-registration pattern as all other
adapters in the package:

```
__init__.py
  └─ pkgutil.iter_modules → importlib.import_module
       ├─ plugin_l2_adapter.py (auto-discovered)
       │    ├─ register_l2_adapter_type("plugin", PluginL2AdapterConfig)
       │    └─ register_l2_adapter_factory("plugin", _create_plugin_adapter)
       │
       ├─ raw_block_l2_adapter.py (auto-discovered)
       │    ├─ register_l2_adapter_type("raw_block", RawBlockL2AdapterConfig)
       │    └─ register_l2_adapter_factory("raw_block", _create_raw_block_adapter)
       │
       └─ native_connector_l2_adapter.py (auto-discovered)
            ├─ register_l2_adapter_type("resp", ...)
            ├─ register_l2_adapter_type("fs_native", ...)
            └─ register_l2_adapter_type("native_plugin", NativePluginL2AdapterConfig)
```

No changes to existing codes are needed when these modules
are present in the `l2_adapters/` package directory.
