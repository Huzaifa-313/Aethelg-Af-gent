"""
Security & Guardrails Engine — extracted from OpenJarvis-main.

Combines security patterns from:
  - OpenJarvis-main/security: GuardrailsEngine, PIIScanner, SecretScanner,
    InjectionScanner, RateLimiter, FilePolicy, SubprocessSandbox, SSRF protection
  - OpenJarvis-main/security: CredentialStripper, TaintTracking, Signing

This module provides a portable, self-contained security layer that can:
  - Scan inputs/outputs for PII, secrets, and injection attacks
  - Apply guardrails (WARN / REDACT / BLOCK) to LLM interactions
  - Rate-limit requests per client/key
  - Enforce file access policies
  - Sandbox subprocess execution
  - Detect and prevent SSRF attacks

Gold-safe: This file is ADDITIVE only — it does not modify any existing gold data.
"""

from __future__ import annotations

import hashlib
import logging
import os
import re
import subprocess
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Sequence, Set, Tuple

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Core types
# ---------------------------------------------------------------------------

class ThreatLevel(str, Enum):
    INFO = "info"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class RedactionMode(str, Enum):
    WARN = "warn"
    REDACT = "redact"
    BLOCK = "block"


@dataclass
class SecurityFinding:
    """A single security finding from a scan."""
    pattern_name: str
    threat_level: ThreatLevel
    description: str
    matched_text: str = ""
    position: Tuple[int, int] = (0, 0)


@dataclass
class ScanResult:
    """Result from a security scan."""
    findings: List[SecurityFinding] = field(default_factory=list)
    is_safe: bool = True

    def __post_init__(self):
        self.is_safe = all(
            f.threat_level not in (ThreatLevel.HIGH, ThreatLevel.CRITICAL)
            for f in self.findings
        )


class SecurityBlockError(Exception):
    """Raised when mode is BLOCK and security findings are detected."""
    pass


# ---------------------------------------------------------------------------
# Abstract scanner interface
# ---------------------------------------------------------------------------

class BaseScanner(ABC):
    """Base class for all security scanners."""

    @abstractmethod
    def scan(self, text: str) -> ScanResult:
        """Scan text and return findings."""
        ...

    @abstractmethod
    def redact(self, text: str) -> str:
        """Redact sensitive content from text."""
        ...


# ---------------------------------------------------------------------------
# Concrete scanners
# ---------------------------------------------------------------------------

class SecretScanner(BaseScanner):
    """Scans text for secrets: API keys, tokens, passwords, etc.

    Extracted from OpenJarvis security/scanner.py SecretScanner pattern.
    """

    # Common secret patterns
    PATTERNS = [
        (r'(?:api[_-]?key|apikey)\s*[=:]\s*["\']?([A-Za-z0-9_\-]{20,})["\']?', "api_key"),
        (r'(?:secret[_-]?key|secretkey)\s*[=:]\s*["\']?([A-Za-z0-9_\-]{20,})["\']?', "secret_key"),
        (r'(?:access[_-]?token|accesstoken)\s*[=:]\s*["\']?([A-Za-z0-9_\-]{20,})["\']?', "access_token"),
        (r'(?:password|passwd|pwd)\s*[=:]\s*["\']?([^\s"\']{8,})["\']?', "password"),
        (r'sk-[A-Za-z0-9]{20,}', "openai_api_key"),
        (r'ghp_[A-Za-z0-9]{36,}', "github_pat"),
        (r'gho_[A-Za-z0-9]{36,}', "github_oauth"),
        (r'AKIA[0-9A-Z]{16}', "aws_access_key"),
        (r'-----BEGIN (?:RSA |EC |DSA )?PRIVATE KEY-----', "private_key"),
        (r'eyJ[A-Za-z0-9_\-]*\.eyJ[A-Za-z0-9_\-]*\.[A-Za-z0-9_\-]*', "jwt_token"),
        (r'(?:Bearer|Basic)\s+[A-Za-z0-9_\-\.]+', "auth_header"),
        (r'mongodb(?:\+srv)?://[^\s]+', "mongodb_uri"),
        (r'postgres(?:ql)?://[^\s]+', "postgres_uri"),
        (r'redis://[^\s]+', "redis_uri"),
        (r'mysql://[^\s]+', "mysql_uri"),
    ]

    def scan(self, text: str) -> ScanResult:
        findings = []
        for pattern, name in self.PATTERNS:
            for match in re.finditer(pattern, text, re.IGNORECASE):
                findings.append(SecurityFinding(
                    pattern_name=name,
                    threat_level=ThreatLevel.HIGH,
                    description=f"Potential {name} detected",
                    matched_text=match.group(0)[:20] + "...",
                    position=(match.start(), match.end()),
                ))
        return ScanResult(findings=findings)

    def redact(self, text: str) -> str:
        result = text
        for pattern, name in self.PATTERNS:
            result = re.sub(pattern, f"[REDACTED_{name.upper()}]", result, flags=re.IGNORECASE)
        return result


class PIIScanner(BaseScanner):
    """Scans text for Personally Identifiable Information.

    Extracted from OpenJarvis security/scanner.py PIIScanner pattern.
    """

    PATTERNS = [
        (r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', "phone_number", ThreatLevel.MEDIUM),
        (r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', "email", ThreatLevel.MEDIUM),
        (r'\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b', "ssn", ThreatLevel.CRITICAL),
        (r'\b\d{16}[-\s]?\d{0,4}\b', "credit_card", ThreatLevel.CRITICAL),
        (r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', "ip_address", ThreatLevel.LOW),
        (r'\b[A-Z][a-z]+ [A-Z][a-z]+\b', "possible_name", ThreatLevel.INFO),
    ]

    def scan(self, text: str) -> ScanResult:
        findings = []
        for pattern, name, level in self.PATTERNS:
            for match in re.finditer(pattern, text):
                findings.append(SecurityFinding(
                    pattern_name=name,
                    threat_level=level,
                    description=f"Potential {name} detected",
                    matched_text=match.group(0),
                    position=(match.start(), match.end()),
                ))
        return ScanResult(findings=findings)

    def redact(self, text: str) -> str:
        result = text
        for pattern, name, _ in self.PATTERNS:
            result = re.sub(pattern, f"[REDACTED_{name.upper()}]", result)
        return result


class InjectionScanner(BaseScanner):
    """Scans text for prompt injection and code injection attacks.

    Extracted from OpenJarvis security/injection_scanner.py pattern.
    """

    INJECTION_PATTERNS = [
        (r'ignore\s+(?:all\s+)?(?:previous|above|prior)\s+(?:instructions|prompts|rules)', "prompt_injection_ignore", ThreatLevel.CRITICAL),
        (r'system\s*:\s*', "system_prompt_leak", ThreatLevel.HIGH),
        (r'(?:sudo|rm\s+-rf|del\s+/[sS]|format\s+[cC]:)', "destructive_command", ThreatLevel.CRITICAL),
        (r'(?:import\s+os|subprocess|eval\s*\(|exec\s*\(|__import__)', "code_injection", ThreatLevel.HIGH),
        (r'(?:UNION\s+SELECT|DROP\s+TABLE|;\s*DELETE\s+FROM)', "sql_injection", ThreatLevel.HIGH),
        (r'<script[^>]*>|javascript:', "xss_attempt", ThreatLevel.HIGH),
        (r'\.\.[\\/]', "path_traversal", ThreatLevel.HIGH),
        (r'(?:http|https|ftp)://[^\s<>"\']+', "url_in_text", ThreatLevel.INFO),
    ]

    def scan(self, text: str) -> ScanResult:
        findings = []
        for pattern, name, level in self.INJECTION_PATTERNS:
            for match in re.finditer(pattern, text, re.IGNORECASE):
                findings.append(SecurityFinding(
                    pattern_name=name,
                    threat_level=level,
                    description=f"Potential {name} detected",
                    matched_text=match.group(0)[:30],
                    position=(match.start(), match.end()),
                ))
        return ScanResult(findings=findings)

    def redact(self, text: str) -> str:
        result = text
        for pattern, name, level in self.INJECTION_PATTERNS:
            if level in (ThreatLevel.HIGH, ThreatLevel.CRITICAL):
                result = re.sub(pattern, f"[BLOCKED_{name.upper()}]", result, flags=re.IGNORECASE)
        return result


class SSRFScanner(BaseScanner):
    """Scans URLs for SSRF (Server-Side Request Forgery) attacks.

    Extracted from OpenJarvis security/ssrf.py pattern.
    """

    BLOCKED_HOSTS = {
        "localhost", "127.0.0.1", "0.0.0.0", "::1",
        "169.254.169.254",  # AWS metadata
        "metadata.google.internal",  # GCP metadata
        "100.100.100.200",  # Alibaba Cloud metadata
    }

    BLOCKED_TLDS = {".internal", ".local", ".localhost"}

    def scan(self, text: str) -> ScanResult:
        findings = []
        url_pattern = r'https?://([^\s/<>"\']+)'
        for match in re.finditer(url_pattern, text):
            host = match.group(1).split(":")[0].lower()
            if host in self.BLOCKED_HOSTS:
                findings.append(SecurityFinding(
                    pattern_name="ssrf_internal_host",
                    threat_level=ThreatLevel.CRITICAL,
                    description=f"SSRF attempt: internal host '{host}'",
                    matched_text=match.group(0),
                    position=(match.start(), match.end()),
                ))
            for tld in self.BLOCKED_TLDS:
                if host.endswith(tld):
                    findings.append(SecurityFinding(
                        pattern_name="ssrf_internal_tld",
                        threat_level=ThreatLevel.HIGH,
                        description=f"SSRF attempt: internal TLD '{tld}'",
                        matched_text=match.group(0),
                        position=(match.start(), match.end()),
                    ))
        return ScanResult(findings=findings)

    def redact(self, text: str) -> str:
        result = text
        url_pattern = r'https?://([^\s/<>"\']+)'
        for match in re.finditer(url_pattern, text):
            host = match.group(1).split(":")[0].lower()
            if host in self.BLOCKED_HOSTS or any(host.endswith(t) for t in self.BLOCKED_TLDS):
                result = result.replace(match.group(0), "[BLOCKED_SSRF_URL]")
        return result


# ---------------------------------------------------------------------------
# Rate Limiter
# ---------------------------------------------------------------------------

@dataclass
class RateLimitEntry:
    """Tracks rate limit state for a single client."""
    count: int = 0
    window_start: float = 0.0
    blocked_until: float = 0.0


class RateLimiter:
    """Token-bucket rate limiter.

    Extracted from OpenJarvis security/rate_limiter.py pattern.
    """

    def __init__(
        self,
        max_requests: int = 60,
        window_seconds: int = 60,
        cooldown_seconds: int = 60,
    ):
        self._max_requests = max_requests
        self._window_seconds = window_seconds
        self._cooldown_seconds = cooldown_seconds
        self._entries: Dict[str, RateLimitEntry] = {}

    def check(self, client_id: str) -> Tuple[bool, Optional[str]]:
        """Check if a request is allowed. Returns (allowed, reason)."""
        now = time.time()
        entry = self._entries.get(client_id)

        if entry is None:
            self._entries[client_id] = RateLimitEntry(count=1, window_start=now)
            return True, None

        # Check cooldown
        if entry.blocked_until > now:
            remaining = int(entry.blocked_until - now)
            return False, f"Rate limited: cooldown {remaining}s remaining"

        # Check window
        if now - entry.window_start > self._window_seconds:
            entry.count = 1
            entry.window_start = now
            return True, None

        entry.count += 1
        if entry.count > self._max_requests:
            entry.blocked_until = now + self._cooldown_seconds
            return False, f"Rate limited: {entry.count}/{self._max_requests} in window"

        return True, None

    def reset(self, client_id: Optional[str] = None) -> None:
        if client_id:
            self._entries.pop(client_id, None)
        else:
            self._entries.clear()


# ---------------------------------------------------------------------------
# File Policy
# ---------------------------------------------------------------------------

class FilePolicy:
    """Enforces file access policies.

    Extracted from OpenJarvis security/file_policy.py pattern.
    """

    def __init__(
        self,
        allowed_dirs: Optional[List[str]] = None,
        blocked_dirs: Optional[List[str]] = None,
        blocked_extensions: Optional[List[str]] = None,
        max_file_size_mb: float = 10.0,
        allow_write: bool = True,
        allow_delete: bool = False,
    ):
        self._allowed_dirs = [Path(d).resolve() for d in (allowed_dirs or [])]
        self._blocked_dirs = [Path(d).resolve() for d in (blocked_dirs or [])]
        self._blocked_extensions = set(blocked_extensions or [
            ".exe", ".bat", ".cmd", ".ps1", ".vbs", ".msi",
            ".sh", ".bash", ".dll", ".so", ".dylib",
        ])
        self._max_file_size = max_file_size_mb * 1024 * 1024
        self._allow_write = allow_write
        self._allow_delete = allow_delete

    def check_read(self, filepath: str) -> Tuple[bool, Optional[str]]:
        """Check if reading a file is allowed."""
        path = Path(filepath).resolve()
        return self._validate_path(path, "read")

    def check_write(self, filepath: str) -> Tuple[bool, Optional[str]]:
        """Check if writing a file is allowed."""
        if not self._allow_write:
            return False, "Write operations are disabled"
        path = Path(filepath).resolve()
        return self._validate_path(path, "write")

    def check_delete(self, filepath: str) -> Tuple[bool, Optional[str]]:
        """Check if deleting a file is allowed."""
        if not self._allow_delete:
            return False, "Delete operations are disabled"
        path = Path(filepath).resolve()
        return self._validate_path(path, "delete")

    def _validate_path(self, path: Path, operation: str) -> Tuple[bool, Optional[str]]:
        # Check extension
        if path.suffix.lower() in self._blocked_extensions:
            return False, f"Blocked file extension: {path.suffix}"

        # Check blocked dirs
        for blocked in self._blocked_dirs:
            try:
                path.relative_to(blocked)
                return False, f"Access to blocked directory: {blocked}"
            except ValueError:
                pass

        # Check allowed dirs (if specified)
        if self._allowed_dirs:
            in_allowed = False
            for allowed in self._allowed_dirs:
                try:
                    path.relative_to(allowed)
                    in_allowed = True
                    break
                except ValueError:
                    pass
            if not in_allowed:
                return False, "Path outside allowed directories"

        # Check file size for reads
        if operation == "read" and path.exists():
            if path.stat().st_size > self._max_file_size:
                return False, f"File too large: {path.stat().st_size / 1024 / 1024:.1f}MB"

        return True, None


# ---------------------------------------------------------------------------
# Subprocess Sandbox
# ---------------------------------------------------------------------------

class SubprocessSandbox:
    """Sandboxed subprocess execution.

    Extracted from OpenJarvis security/subprocess_sandbox.py pattern.
    """

    BLOCKED_COMMANDS = {
        "rm", "del", "format", "fdisk", "mkfs",
        "shutdown", "reboot", "halt", "poweroff",
        "dd", "chmod", "chown",
    }

    def __init__(
        self,
        allowed_commands: Optional[Set[str]] = None,
        timeout: int = 30,
        max_output_bytes: int = 1024 * 1024,
    ):
        self._allowed_commands = allowed_commands
        self._timeout = timeout
        self._max_output_bytes = max_output_bytes

    def check_command(self, command: List[str]) -> Tuple[bool, Optional[str]]:
        """Check if a command is allowed to execute."""
        if not command:
            return False, "Empty command"

        cmd_name = os.path.basename(command[0]).lower()

        if cmd_name in self.BLOCKED_COMMANDS:
            return False, f"Blocked command: {cmd_name}"

        if self._allowed_commands is not None and cmd_name not in self._allowed_commands:
            return False, f"Command not in allowlist: {cmd_name}"

        return True, None

    def execute(self, command: List[str], **kwargs) -> subprocess.CompletedProcess:
        """Execute a command in the sandbox."""
        allowed, reason = self.check_command(command)
        if not allowed:
            raise PermissionError(f"Command blocked: {reason}")

        kwargs.setdefault("timeout", self._timeout)
        kwargs.setdefault("capture_output", True)
        kwargs.setdefault("text", True)

        result = subprocess.run(command, **kwargs)

        # Truncate output if too large
        if result.stdout and len(result.stdout.encode()) > self._max_output_bytes:
            result = subprocess.CompletedProcess(
                args=result.args,
                returncode=result.returncode,
                stdout=result.stdout[:self._max_output_bytes] + "\n... [TRUNCATED]",
                stderr=result.stderr,
            )

        return result


# ---------------------------------------------------------------------------
# Guardrails Engine (main entry point)
# ---------------------------------------------------------------------------

class GuardrailsEngine:
    """Wraps LLM interactions with security scanning.

    Extracted from OpenJarvis security/guardrails.py GuardrailsEngine pattern.

    Usage:
        engine = GuardrailsEngine(mode=RedactionMode.REDACT)
        safe_input = engine.scan_input("user message with sk-abc123...")
        safe_output = engine.scan_output("model response with PII...")
    """

    def __init__(
        self,
        scanners: Optional[List[BaseScanner]] = None,
        mode: RedactionMode = RedactionMode.WARN,
        scan_input: bool = True,
        scan_output: bool = True,
        rate_limiter: Optional[RateLimiter] = None,
        file_policy: Optional[FilePolicy] = None,
        subprocess_sandbox: Optional[SubprocessSandbox] = None,
        event_callback: Optional[Callable[[str, Dict], None]] = None,
    ):
        self._scanners = scanners or [
            SecretScanner(),
            PIIScanner(),
            InjectionScanner(),
            SSRFScanner(),
        ]
        self._mode = mode
        self._scan_input = scan_input
        self._scan_output = scan_output
        self._rate_limiter = rate_limiter or RateLimiter()
        self._file_policy = file_policy or FilePolicy()
        self._subprocess_sandbox = subprocess_sandbox or SubprocessSandbox()
        self._event_callback = event_callback
        self._scan_log: List[Dict] = []

    def _emit_event(self, event_type: str, data: Dict) -> None:
        if self._event_callback:
            self._event_callback(event_type, data)

    def _scan_text(self, text: str) -> ScanResult:
        """Run all scanners on text and merge findings."""
        merged = ScanResult()
        for scanner in self._scanners:
            result = scanner.scan(text)
            merged.findings.extend(result.findings)
        merged.is_safe = all(
            f.threat_level not in (ThreatLevel.HIGH, ThreatLevel.CRITICAL)
            for f in merged.findings
        )
        return merged

    def _redact_text(self, text: str) -> str:
        """Run all scanners' redact() on text."""
        result = text
        for scanner in self._scanners:
            result = scanner.redact(result)
        return result

    def _handle_findings(self, text: str, result: ScanResult, direction: str) -> str:
        """Apply the configured mode to findings."""
        finding_dicts = [
            {
                "pattern": f.pattern_name,
                "threat": f.threat_level.value,
                "description": f.description,
            }
            for f in result.findings
        ]

        self._scan_log.append({
            "direction": direction,
            "findings": finding_dicts,
            "mode": self._mode.value,
            "timestamp": time.time(),
        })

        if not result.findings:
            return text

        self._emit_event("security_alert", {
            "direction": direction,
            "findings": finding_dicts,
            "mode": self._mode.value,
        })

        if self._mode == RedactionMode.WARN:
            logger.warning(f"Security findings ({direction}): {finding_dicts}")
            return text

        if self._mode == RedactionMode.REDACT:
            redacted = self._redact_text(text)
            logger.info(f"Redacted {len(result.findings)} findings ({direction})")
            return redacted

        # BLOCK mode
        raise SecurityBlockError(
            f"Blocked: {len(result.findings)} security findings in {direction}: "
            + "; ".join(f['description'] for f in finding_dicts)
        )

    def scan_input(self, text: str, client_id: str = "default") -> str:
        """Scan and process input text (user → LLM)."""
        # Rate limit check
        allowed, reason = self._rate_limiter.check(client_id)
        if not allowed:
            raise SecurityBlockError(f"Rate limited: {reason}")

        if not self._scan_input:
            return text

        result = self._scan_text(text)
        return self._handle_findings(text, result, "input")

    def scan_output(self, text: str) -> str:
        """Scan and process output text (LLM → user)."""
        if not self._scan_output:
            return text

        result = self._scan_text(text)
        return self._handle_findings(text, result, "output")

    def check_file_access(self, filepath: str, operation: str = "read") -> Tuple[bool, Optional[str]]:
        """Check file access policy."""
        if operation == "read":
            return self._file_policy.check_read(filepath)
        elif operation == "write":
            return self._file_policy.check_write(filepath)
        elif operation == "delete":
            return self._file_policy.check_delete(filepath)
        return False, f"Unknown operation: {operation}"

    def check_command(self, command: List[str]) -> Tuple[bool, Optional[str]]:
        """Check if a command is allowed."""
        return self._subprocess_sandbox.check_command(command)

    def execute_command(self, command: List[str], **kwargs) -> subprocess.CompletedProcess:
        """Execute a command in the sandbox."""
        return self._subprocess_sandbox.execute(command, **kwargs)

    @property
    def scan_log(self) -> List[Dict]:
        return list(self._scan_log)

    def clear_log(self) -> None:
        self._scan_log.clear()


# ---------------------------------------------------------------------------
# Convenience factory
# ---------------------------------------------------------------------------

def create_guardrails_engine(
    mode: str = "warn",
    scan_input: bool = True,
    scan_output: bool = True,
    max_requests_per_minute: int = 60,
    allowed_dirs: Optional[List[str]] = None,
    blocked_dirs: Optional[List[str]] = None,
) -> GuardrailsEngine:
    """Create a pre-configured GuardrailsEngine.

    Args:
        mode: "warn", "redact", or "block"
        scan_input: Whether to scan user inputs
        scan_output: Whether to scan model outputs
        max_requests_per_minute: Rate limit
        allowed_dirs: Directories file access is allowed in
        blocked_dirs: Directories file access is blocked in

    Returns:
        Configured GuardrailsEngine instance
    """
    return GuardrailsEngine(
        mode=RedactionMode(mode),
        scan_input=scan_input,
        scan_output=scan_output,
        rate_limiter=RateLimiter(max_requests=max_requests_per_minute),
        file_policy=FilePolicy(allowed_dirs=allowed_dirs, blocked_dirs=blocked_dirs),
    )
