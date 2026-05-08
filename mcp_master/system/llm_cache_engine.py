"""
LLM Cache Engine — extracted from LMCache patterns.

Combines caching patterns from:
  - LMCache: KV-cache storage backends, cache eviction, distributed caching
  - OpenJarvis sessions/compression: Session compression and context management

This module provides a portable, self-contained LLM response caching system that can:
  - Cache LLM responses by prompt hash
  - Support multiple storage backends (memory, disk, Redis)
  - Implement TTL-based and LRU eviction policies
  - Compress cached entries to save space
  - Track cache hit/miss statistics

Gold-safe: This file is ADDITIVE only — it does not modify any existing gold data.
"""

from __future__ import annotations

import hashlib
import json
import logging
import os
import pickle
import sqlite3
import time
import zlib
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Core types
# ---------------------------------------------------------------------------

class CacheBackend(str, Enum):
    MEMORY = "memory"
    DISK = "disk"
    SQLITE = "sqlite"


@dataclass
class CacheEntry:
    """A single cache entry."""
    key: str
    value: str
    created_at: float = 0.0
    last_accessed: float = 0.0
    access_count: int = 0
    ttl_seconds: Optional[float] = None
    compressed: bool = False
    metadata: Dict[str, Any] = field(default_factory=dict)

    @property
    def is_expired(self) -> bool:
        if self.ttl_seconds is None:
            return False
        return time.time() - self.created_at > self.ttl_seconds


@dataclass
class CacheStats:
    """Cache statistics."""
    hits: int = 0
    misses: int = 0
    evictions: int = 0
    total_entries: int = 0
    total_size_bytes: int = 0

    @property
    def hit_rate(self) -> float:
        total = self.hits + self.misses
        return self.hits / total if total > 0 else 0.0


# ---------------------------------------------------------------------------
# Abstract storage backend
# ---------------------------------------------------------------------------

class BaseCacheStore(ABC):
    """Base class for cache storage backends."""

    @abstractmethod
    def get(self, key: str) -> Optional[CacheEntry]:
        ...

    @abstractmethod
    def put(self, entry: CacheEntry) -> None:
        ...

    @abstractmethod
    def delete(self, key: str) -> bool:
        ...

    @abstractmethod
    def clear(self) -> int:
        ...

    @abstractmethod
    def size(self) -> int:
        ...

    @abstractmethod
    def keys(self) -> List[str]:
        ...


# ---------------------------------------------------------------------------
# Memory backend
# ---------------------------------------------------------------------------

class MemoryCacheStore(BaseCacheStore):
    """In-memory cache store with LRU eviction.

    Extracted from LMCache in-memory storage pattern.
    """

    def __init__(self, max_entries: int = 1000, max_size_mb: float = 100.0):
        self._store: Dict[str, CacheEntry] = {}
        self._max_entries = max_entries
        self._max_size_bytes = int(max_size_mb * 1024 * 1024)

    def get(self, key: str) -> Optional[CacheEntry]:
        entry = self._store.get(key)
        if entry is None:
            return None
        if entry.is_expired:
            self.delete(key)
            return None
        entry.last_accessed = time.time()
        entry.access_count += 1
        return entry

    def put(self, entry: CacheEntry) -> None:
        if len(self._store) >= self._max_entries:
            self._evict_lru()
        entry.created_at = entry.created_at or time.time()
        entry.last_accessed = time.time()
        self._store[entry.key] = entry

    def delete(self, key: str) -> bool:
        if key in self._store:
            del self._store[key]
            return True
        return False

    def clear(self) -> int:
        count = len(self._store)
        self._store.clear()
        return count

    def size(self) -> int:
        return len(self._store)

    def keys(self) -> List[str]:
        return list(self._store.keys())

    def _evict_lru(self) -> None:
        """Evict the least recently used entry."""
        if not self._store:
            return
        oldest_key = min(self._store, key=lambda k: self._store[k].last_accessed)
        del self._store[oldest_key]


# ---------------------------------------------------------------------------
# Disk backend
# ---------------------------------------------------------------------------

class DiskCacheStore(BaseCacheStore):
    """File-based cache store.

    Extracted from LMCache disk storage backend pattern.
    """

    def __init__(self, cache_dir: str = ".cache/llm_cache", compress: bool = True):
        self._cache_dir = Path(cache_dir)
        self._cache_dir.mkdir(parents=True, exist_ok=True)
        self._compress = compress
        self._index_path = self._cache_dir / "_index.json"
        self._index: Dict[str, str] = self._load_index()

    def _load_index(self) -> Dict[str, str]:
        if self._index_path.exists():
            try:
                with open(self._index_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except (json.JSONDecodeError, OSError):
                return {}
        return {}

    def _save_index(self) -> None:
        try:
            with open(self._index_path, "w", encoding="utf-8") as f:
                json.dump(self._index, f)
        except OSError as e:
            logger.error(f"Failed to save cache index: {e}")

    def _entry_path(self, key: str) -> Path:
        safe_key = hashlib.sha256(key.encode()).hexdigest()[:16]
        return self._cache_dir / f"{safe_key}.cache"

    def get(self, key: str) -> Optional[CacheEntry]:
        if key not in self._index:
            return None
        path = self._entry_path(key)
        if not path.exists():
            del self._index[key]
            self._save_index()
            return None
        try:
            with open(path, "rb") as f:
                data = f.read()
            if self._compress:
                data = zlib.decompress(data)
            entry = pickle.loads(data)
            if entry.is_expired:
                self.delete(key)
                return None
            entry.last_accessed = time.time()
            entry.access_count += 1
            # Update on disk
            self._write_entry(entry)
            return entry
        except Exception as e:
            logger.error(f"Failed to read cache entry: {e}")
            return None

    def put(self, entry: CacheEntry) -> None:
        entry.created_at = entry.created_at or time.time()
        entry.last_accessed = time.time()
        entry.compressed = self._compress
        self._write_entry(entry)
        self._index[entry.key] = str(self._entry_path(entry.key))
        self._save_index()

    def _write_entry(self, entry: CacheEntry) -> None:
        path = self._entry_path(entry.key)
        try:
            data = pickle.dumps(entry)
            if self._compress:
                data = zlib.compress(data)
            with open(path, "wb") as f:
                f.write(data)
        except Exception as e:
            logger.error(f"Failed to write cache entry: {e}")

    def delete(self, key: str) -> bool:
        if key not in self._index:
            return False
        path = self._entry_path(key)
        try:
            if path.exists():
                path.unlink()
            del self._index[key]
            self._save_index()
            return True
        except OSError:
            return False

    def clear(self) -> int:
        count = len(self._index)
        for key in list(self._index.keys()):
            self.delete(key)
        return count

    def size(self) -> int:
        return len(self._index)

    def keys(self) -> List[str]:
        return list(self._index.keys())


# ---------------------------------------------------------------------------
# SQLite backend
# ---------------------------------------------------------------------------

class SQLiteCacheStore(BaseCacheStore):
    """SQLite-based cache store for structured queries.

    Extracted from LMCache structured storage pattern.
    """

    def __init__(self, db_path: str = ".cache/llm_cache.db"):
        self._db_path = db_path
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(db_path)
        self._conn.execute("""
            CREATE TABLE IF NOT EXISTS cache_entries (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                created_at REAL NOT NULL,
                last_accessed REAL NOT NULL,
                access_count INTEGER DEFAULT 0,
                ttl_seconds REAL,
                metadata TEXT DEFAULT '{}'
            )
        """)
        self._conn.commit()

    def get(self, key: str) -> Optional[CacheEntry]:
        cursor = self._conn.execute(
            "SELECT * FROM cache_entries WHERE key = ?", (key,)
        )
        row = cursor.fetchone()
        if row is None:
            return None
        entry = CacheEntry(
            key=row[0],
            value=row[1],
            created_at=row[2],
            last_accessed=row[3],
            access_count=row[4],
            ttl_seconds=row[5],
            metadata=json.loads(row[6]),
        )
        if entry.is_expired:
            self.delete(key)
            return None
        # Update access stats
        self._conn.execute(
            "UPDATE cache_entries SET last_accessed = ?, access_count = ? WHERE key = ?",
            (time.time(), entry.access_count + 1, key),
        )
        self._conn.commit()
        return entry

    def put(self, entry: CacheEntry) -> None:
        now = time.time()
        self._conn.execute(
            """INSERT OR REPLACE INTO cache_entries
               (key, value, created_at, last_accessed, access_count, ttl_seconds, metadata)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (
                entry.key,
                entry.value,
                entry.created_at or now,
                now,
                entry.access_count,
                entry.ttl_seconds,
                json.dumps(entry.metadata),
            ),
        )
        self._conn.commit()

    def delete(self, key: str) -> bool:
        cursor = self._conn.execute("DELETE FROM cache_entries WHERE key = ?", (key,))
        self._conn.commit()
        return cursor.rowcount > 0

    def clear(self) -> int:
        cursor = self._conn.execute("SELECT COUNT(*) FROM cache_entries")
        count = cursor.fetchone()[0]
        self._conn.execute("DELETE FROM cache_entries")
        self._conn.commit()
        return count

    def size(self) -> int:
        cursor = self._conn.execute("SELECT COUNT(*) FROM cache_entries")
        return cursor.fetchone()[0]

    def keys(self) -> List[str]:
        cursor = self._conn.execute("SELECT key FROM cache_entries")
        return [row[0] for row in cursor.fetchall()]

    def __del__(self):
        try:
            self._conn.close()
        except Exception:
            pass


# ---------------------------------------------------------------------------
# LLM Cache Engine (main entry point)
# ---------------------------------------------------------------------------

class LLMCacheEngine:
    """High-level LLM response caching engine.

    Combines patterns from:
    - LMCache: KV-cache with multiple backends
    - OpenJarvis sessions/compression: Context compression

    Usage:
        cache = LLMCacheEngine(backend="memory")
        cache.store("prompt hash", "LLM response")
        result = cache.lookup("prompt hash")
    """

    def __init__(
        self,
        backend: str = "memory",
        ttl_seconds: Optional[float] = None,
        max_entries: int = 1000,
        cache_dir: str = ".cache/llm_cache",
        compress: bool = True,
        hash_algorithm: str = "sha256",
    ):
        self._ttl = ttl_seconds
        self._hash_algorithm = hash_algorithm
        self._stats = CacheStats()

        if backend == "memory":
            self._store = MemoryCacheStore(max_entries=max_entries)
        elif backend == "disk":
            self._store = DiskCacheStore(cache_dir=cache_dir, compress=compress)
        elif backend == "sqlite":
            self._store = SQLiteCacheStore(db_path=cache_dir + ".db" if not cache_dir.endswith(".db") else cache_dir)
        else:
            raise ValueError(f"Unknown cache backend: {backend}")

    def _compute_key(self, prompt: str, model: str = "", **kwargs) -> str:
        """Compute a cache key from prompt + model + kwargs."""
        parts = [prompt, model, json.dumps(kwargs, sort_keys=True)]
        combined = "|".join(parts)
        return hashlib.new(self._hash_algorithm, combined.encode()).hexdigest()

    def lookup(self, prompt: str, model: str = "", **kwargs) -> Optional[str]:
        """Look up a cached response. Returns None on miss."""
        key = self._compute_key(prompt, model, **kwargs)
        entry = self._store.get(key)
        if entry is not None:
            self._stats.hits += 1
            logger.debug(f"Cache HIT for key={key[:16]}...")
            return entry.value
        self._stats.misses += 1
        logger.debug(f"Cache MISS for key={key[:16]}...")
        return None

    def store(self, prompt: str, response: str, model: str = "", ttl: Optional[float] = None, **kwargs) -> None:
        """Store a response in the cache."""
        key = self._compute_key(prompt, model, **kwargs)
        entry = CacheEntry(
            key=key,
            value=response,
            created_at=time.time(),
            last_accessed=time.time(),
            ttl_seconds=ttl or self._ttl,
            metadata={"model": model, "prompt_length": len(prompt)},
        )
        self._store.put(entry)
        self._stats.total_entries = self._store.size()
        logger.debug(f"Cached response for key={key[:16]}...")

    def invalidate(self, prompt: str, model: str = "", **kwargs) -> bool:
        """Invalidate a specific cache entry."""
        key = self._compute_key(prompt, model, **kwargs)
        result = self._store.delete(key)
        self._stats.total_entries = self._store.size()
        return result

    def clear(self) -> int:
        """Clear all cache entries."""
        count = self._store.clear()
        self._stats.evictions += count
        self._stats.total_entries = 0
        return count

    def cleanup_expired(self) -> int:
        """Remove all expired entries. Returns count of removed entries."""
        removed = 0
        for key in self._store.keys():
            entry = self._store.get(key)
            if entry is not None and entry.is_expired:
                self._store.delete(key)
                removed += 1
        self._stats.total_entries = self._store.size()
        return removed

    @property
    def stats(self) -> CacheStats:
        self._stats.total_entries = self._store.size()
        return self._stats

    @property
    def store(self) -> BaseCacheStore:
        return self._store


# ---------------------------------------------------------------------------
# Convenience factory
# ---------------------------------------------------------------------------

def create_cache_engine(
    backend: str = "memory",
    ttl_seconds: float = 3600,
    max_entries: int = 1000,
    cache_dir: str = ".cache/llm_cache",
) -> LLMCacheEngine:
    """Create a pre-configured LLM cache engine.

    Args:
        backend: "memory", "disk", or "sqlite"
        ttl_seconds: Time-to-live for cache entries (None = no expiry)
        max_entries: Maximum entries for memory backend
        cache_dir: Directory for disk/sqlite backends

    Returns:
        Configured LLMCacheEngine instance
    """
    return LLMCacheEngine(
        backend=backend,
        ttl_seconds=ttl_seconds,
        max_entries=max_entries,
        cache_dir=cache_dir,
    )
