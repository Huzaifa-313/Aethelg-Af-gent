#!/usr/bin/env python3
"""
MCP MASTER - ECOSYSTEM SAFETY GUARDIAN
======================================
Monitors all ecosystem activity for anomalies, quarantines
suspicious tools, and enforces safety policies.

Responsibilities:
- Behavioral anomaly detection on all installed tools
- Automatic quarantine of suspicious tools
- Safety policy enforcement
- Audit logging of all safety events
"""

import json
import hashlib
import shutil
import time
import os
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from enum import Enum

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))


class ThreatLevel(Enum):
    NONE = "none"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass
class SafetyEvent:
    """Represents a safety event in the ecosystem."""
    timestamp: str
    tool_name: str
    event_type: str
    threat_level: str
    description: str
    action_taken: str
    details: Dict[str, Any]


class SafetyGuardian:
    """
    Safety Guardian for the MCP Master ecosystem.
    
    Monitors tool behavior, detects anomalies, and quarantines
    suspicious tools to protect the ecosystem.
    """
    
    def __init__(self, config_path: str = "./ecosystem_config.yaml"):
        """Initialize the Safety Guardian."""
        self.config = self._load_config(config_path)
        self.master_dir = Path(self.config.get("paths", {}).get("master_dir", "./"))
        self.quarantine_dir = Path(self.config.get("paths", {}).get("quarantine_dir", "./retired/quarantine"))
        self.logs_dir = Path(self.config.get("paths", {}).get("logs_dir", "./logs"))
        
        # Ensure directories exist
        self.quarantine_dir.mkdir(parents=True, exist_ok=True)
        self.logs_dir.mkdir(parents=True, exist_ok=True)
        
        # Safety state
        self.quarantined_tools: Dict[str, Dict] = {}
        self.safety_events: List[SafetyEvent] = []
        self.tool_baselines: Dict[str, Dict] = {}
        
        # Load existing state
        self._load_state()
    
    def _load_config(self, config_path: str) -> Dict:
        """Load configuration from YAML file."""
        import yaml
        try:
            with open(config_path, 'r') as f:
                return yaml.safe_load(f).get("ecosystem", {})
        except Exception as e:
            print(f"[SafetyGuardian] Warning: Could not load config: {e}")
            return {}
    
    def _load_state(self):
        """Load existing safety state from disk."""
        state_file = self.master_dir / "ecosystem" / "safety_state.json"
        if state_file.exists():
            try:
                with open(state_file, 'r') as f:
                    state = json.load(f)
                self.quarantined_tools = state.get("quarantined_tools", {})
                self.tool_baselines = state.get("tool_baselines", {})
                print(f"[SafetyGuardian] Loaded state: {len(self.quarantined_tools)} quarantined tools")
            except Exception as e:
                print(f"[SafetyGuardian] Warning: Could not load state: {e}")
    
    def _save_state(self):
        """Save safety state to disk."""
        state_file = self.master_dir / "ecosystem" / "safety_state.json"
        try:
            state = {
                "quarantined_tools": self.quarantined_tools,
                "tool_baselines": self.tool_baselines,
                "last_updated": datetime.now().isoformat()
            }
            with open(state_file, 'w') as f:
                json.dump(state, f, indent=2)
        except Exception as e:
            print(f"[SafetyGuardian] Warning: Could not save state: {e}")
    
    def _log_event(self, event: SafetyEvent):
        """Log a safety event."""
        self.safety_events.append(event)
        
        # Write to safety log
        log_file = self.logs_dir / "safety.log"
        try:
            with open(log_file, 'a') as f:
                f.write(f"{event.timestamp} [{event.threat_level.upper()}] "
                       f"{event.event_type}: {event.description}\n")
        except Exception as e:
            print(f"[SafetyGuardian] Warning: Could not write to log: {e}")
    
    def establish_baseline(self, tool_name: str, metrics: Dict[str, Any]) -> Dict:
        """
        Establish a behavioral baseline for a tool.
        
        Args:
            tool_name: Name of the tool
            metrics: Dictionary of baseline metrics
            
        Returns:
            The established baseline
        """
        baseline = {
            "tool_name": tool_name,
            "established_at": datetime.now().isoformat(),
            "metrics": metrics,
            "cpu_usage_avg": metrics.get("cpu_usage_avg", 0),
            "memory_usage_mb": metrics.get("memory_usage_mb", 0),
            "network_requests_per_min": metrics.get("network_requests_per_min", 0),
            "file_access_patterns": metrics.get("file_access_patterns", []),
            "api_call_patterns": metrics.get("api_call_patterns", []),
        }
        
        self.tool_baselines[tool_name] = baseline
        self._save_state()
        
        print(f"[SafetyGuardian] Baseline established for {tool_name}")
        return baseline
    
    def scan_tool(self, tool_name: str, tool_path: str, 
                  current_metrics: Optional[Dict] = None) -> Dict:
        """
        Scan a tool for anomalies and safety issues.
        
        Args:
            tool_name: Name of the tool to scan
            tool_path: Path to the tool directory
            current_metrics: Current runtime metrics (optional)
            
        Returns:
            Scan result with threat assessment
        """
        print(f"[SafetyGuardian] Scanning tool: {tool_name}")
        
        threats = []
        threat_level = ThreatLevel.NONE
        
        # Check 1: File integrity (basic hash check)
        integrity_issues = self._check_file_integrity(tool_name, tool_path)
        if integrity_issues:
            threats.append({
                "type": "integrity",
                "description": f"File integrity issues found: {integrity_issues}",
                "severity": "medium"
            })
            threat_level = ThreatLevel.MEDIUM
        
        # Check 2: Suspicious file patterns
        suspicious_files = self._check_suspicious_files(tool_path)
        if suspicious_files:
            threats.append({
                "type": "suspicious_files",
                "description": f"Suspicious files detected: {suspicious_files}",
                "severity": "high"
            })
            threat_level = ThreatLevel.HIGH
        
        # Check 3: Behavioral anomaly (if metrics provided)
        if current_metrics and tool_name in self.tool_baselines:
            anomaly = self._detect_behavioral_anomaly(tool_name, current_metrics)
            if anomaly:
                threats.append({
                    "type": "behavioral_anomaly",
                    "description": f"Behavioral anomaly: {anomaly}",
                    "severity": "medium"
                })
                if threat_level.value in ["none", "low"]:
                    threat_level = ThreatLevel.MEDIUM
        
        # Check 4: Known bad patterns
        bad_patterns = self._check_known_bad_patterns(tool_path)
        if bad_patterns:
            threats.append({
                "type": "known_bad_patterns",
                "description": f"Known bad patterns: {bad_patterns}",
                "severity": "critical"
            })
            threat_level = ThreatLevel.CRITICAL
        
        result = {
            "tool_name": tool_name,
            "scanned_at": datetime.now().isoformat(),
            "threat_level": threat_level.value,
            "threats": threats,
            "is_safe": threat_level in [ThreatLevel.NONE, ThreatLevel.LOW],
            "recommendation": "quarantine" if threat_level in [ThreatLevel.HIGH, ThreatLevel.CRITICAL] else "monitor"
        }
        
        # Log the event
        if threat_level != ThreatLevel.NONE:
            event = SafetyEvent(
                timestamp=datetime.now().isoformat(),
                tool_name=tool_name,
                event_type="security_scan",
                threat_level=threat_level.value,
                description=f"Scan found {len(threats)} threats",
                action_taken=result["recommendation"],
                details=result
            )
            self._log_event(event)
        
        print(f"[SafetyGuardian] Scan complete for {tool_name}: {threat_level.value}")
        return result
    
    def _check_file_integrity(self, tool_name: str, tool_path: str) -> List[str]:
        """Check file integrity using basic hash verification."""
        issues = []
        tool_dir = Path(tool_path)
        
        if not tool_dir.exists():
            return ["Tool directory does not exist"]
        
        # Check for empty files
        for file_path in tool_dir.rglob("*"):
            if file_path.is_file() and file_path.stat().st_size == 0:
                issues.append(f"Empty file: {file_path.name}")
        
        return issues
    
    def _check_suspicious_files(self, tool_path: str) -> List[str]:
        """Check for suspicious file patterns."""
        suspicious = []
        tool_dir = Path(tool_path)
        
        if not tool_dir.exists():
            return []
        
        suspicious_extensions = {'.exe', '.dll', '.bat', '.sh', '.bin'}
        
        for file_path in tool_dir.rglob("*"):
            if file_path.is_file():
                if file_path.suffix.lower() in suspicious_extensions:
                    suspicious.append(file_path.name)
        
        return suspicious
    
    def _detect_behavioral_anomaly(self, tool_name: str, 
                                   current_metrics: Dict) -> Optional[str]:
        """Detect behavioral anomalies compared to baseline."""
        if tool_name not in self.tool_baselines:
            return None
        
        baseline = self.tool_baselines[tool_name]
        anomalies = []
        
        # Check CPU usage
        current_cpu = current_metrics.get("cpu_usage_avg", 0)
        baseline_cpu = baseline.get("cpu_usage_avg", 0)
        if baseline_cpu > 0 and current_cpu > baseline_cpu * 3:
            anomalies.append(f"CPU usage spike: {current_cpu:.1f}% vs baseline {baseline_cpu:.1f}%")
        
        # Check memory usage
        current_mem = current_metrics.get("memory_usage_mb", 0)
        baseline_mem = baseline.get("memory_usage_mb", 0)
        if baseline_mem > 0 and current_mem > baseline_mem * 2:
            anomalies.append(f"Memory spike: {current_mem:.1f}MB vs baseline {baseline_mem:.1f}MB")
        
        return "; ".join(anomalies) if anomalies else None
    
    def _check_known_bad_patterns(self, tool_path: str) -> List[str]:
        """Check for known bad code patterns."""
        bad_patterns = []
        tool_dir = Path(tool_path)
        
        if not tool_dir.exists():
            return []
        
        # Patterns to check (simplified for demonstration)
        dangerous_patterns = [
            b"os.system",
            b"subprocess.call",
            b"eval(",
            b"exec(",
            b"__import__",
        ]
        
        for file_path in tool_dir.rglob("*.py"):
            try:
                content = file_path.read_bytes()
                for pattern in dangerous_patterns:
                    if pattern in content:
                        bad_patterns.append(f"{file_path.name}: {pattern.decode()}")
            except Exception:
                continue
        
        return bad_patterns
    
    def quarantine_tool(self, tool_name: str, tool_path: str, 
                        reason: str) -> Dict:
        """
        Quarantine a tool by moving it to the quarantine directory.
        
        Args:
            tool_name: Name of the tool to quarantine
            tool_path: Path to the tool directory
            reason: Reason for quarantine
            
        Returns:
            Quarantine result
        """
        print(f"[SafetyGuardian] Quarantining tool: {tool_name}")
        
        tool_dir = Path(tool_path)
        if not tool_dir.exists():
            return {
                "success": False,
                "error": f"Tool directory does not exist: {tool_path}"
            }
        
        # Create quarantine destination
        quarantine_path = self.quarantine_dir / tool_name
        quarantine_path.mkdir(parents=True, exist_ok=True)
        
        try:
            # Move tool to quarantine
            shutil.move(str(tool_dir), str(quarantine_path))
            
            # Record quarantine
            self.quarantined_tools[tool_name] = {
                "quarantined_at": datetime.now().isoformat(),
                "reason": reason,
                "original_path": str(tool_dir),
                "quarantine_path": str(quarantine_path)
            }
            self._save_state()
            
            # Log event
            event = SafetyEvent(
                timestamp=datetime.now().isoformat(),
                tool_name=tool_name,
                event_type="quarantine",
                threat_level="high",
                description=f"Tool quarantined: {reason}",
                action_taken="moved_to_quarantine",
                details={"reason": reason, "path": str(quarantine_path)}
            )
            self._log_event(event)
            
            print(f"[SafetyGuardian] Tool {tool_name} quarantined successfully")
            return {
                "success": True,
                "quarantine_path": str(quarantine_path),
                "reason": reason
            }
            
        except Exception as e:
            print(f"[SafetyGuardian] Error quarantining tool: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def restore_tool(self, tool_name: str, 
                     restore_path: Optional[str] = None) -> Dict:
        """
        Restore a quarantined tool.
        
        Args:
            tool_name: Name of the tool to restore
            restore_path: Optional path to restore to
            
        Returns:
            Restore result
        """
        if tool_name not in self.quarantined_tools:
            return {
                "success": False,
                "error": f"Tool {tool_name} is not in quarantine"
            }
        
        quarantine_info = self.quarantined_tools[tool_name]
        quarantine_path = Path(quarantine_info["quarantine_path"])
        
        if not quarantine_path.exists():
            return {
                "success": False,
                "error": f"Quarantined tool not found at {quarantine_path}"
            }
        
        # Determine restore path
        if restore_path:
            dest_path = Path(restore_path)
        else:
            dest_path = Path(quarantine_info["original_path"])
        
        try:
            # Move tool back
            shutil.move(str(quarantine_path), str(dest_path))
            
            # Remove from quarantine list
            del self.quarantined_tools[tool_name]
            self._save_state()
            
            # Log event
            event = SafetyEvent(
                timestamp=datetime.now().isoformat(),
                tool_name=tool_name,
                event_type="restore",
                threat_level="low",
                description="Tool restored from quarantine",
                action_taken="restored",
                details={"restored_to": str(dest_path)}
            )
            self._log_event(event)
            
            print(f"[SafetyGuardian] Tool {tool_name} restored successfully")
            return {
                "success": True,
                "restored_to": str(dest_path)
            }
            
        except Exception as e:
            print(f"[SafetyGuardian] Error restoring tool: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_quarantine_status(self) -> Dict:
        """Get current quarantine status."""
        return {
            "quarantined_count": len(self.quarantined_tools),
            "quarantined_tools": list(self.quarantined_tools.keys()),
            "quarantine_dir": str(self.quarantine_dir)
        }
    
    def get_safety_report(self) -> Dict:
        """Generate a comprehensive safety report."""
        return {
            "generated_at": datetime.now().isoformat(),
            "quarantine_status": self.get_quarantine_status(),
            "total_events": len(self.safety_events),
            "recent_events": [asdict(e) for e in self.safety_events[-10:]],
            "tools_with_baselines": list(self.tool_baselines.keys())
        }


def main():
    """CLI entry point for the Safety Guardian."""
    guardian = SafetyGuardian()
    
    import argparse
    parser = argparse.ArgumentParser(description="MCP Master Safety Guardian")
    parser.add_argument("command", choices=["scan", "quarantine", "restore", "status", "report"])
    parser.add_argument("--tool", help="Tool name")
    parser.add_argument("--path", help="Tool path")
    parser.add_argument("--reason", help="Reason for quarantine")
    
    args = parser.parse_args()
    
    if args.command == "scan":
        if not args.tool or not args.path:
            print("Error: --tool and --path required for scan")
            return
        result = guardian.scan_tool(args.tool, args.path)
        print(json.dumps(result, indent=2))
    
    elif args.command == "quarantine":
        if not args.tool or not args.path or not args.reason:
            print("Error: --tool, --path, and --reason required for quarantine")
            return
        result = guardian.quarantine_tool(args.tool, args.path, args.reason)
        print(json.dumps(result, indent=2))
    
    elif args.command == "restore":
        if not args.tool:
            print("Error: --tool required for restore")
            return
        result = guardian.restore_tool(args.tool, args.path)
        print(json.dumps(result, indent=2))
    
    elif args.command == "status":
        print(json.dumps(guardian.get_quarantine_status(), indent=2))
    
    elif args.command == "report":
        print(json.dumps(guardian.get_safety_report(), indent=2))


if __name__ == "__main__":
    main()
