# Mahoraga MCP Server - Self-Healing Engine
# Autonomous failure detection and recovery

import os
import sys
import json
import shutil
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional, Any
from dataclasses import dataclass, field

@dataclass
class FailureRecord:
    timestamp: str
    tool_name: str
    failure_signature: str
    action_taken: str
    success: bool
    details: str = ""

class SelfHealingEngine:
    """Main self-healing engine for Mahoraga MCP server."""
    
    def __init__(self,
                 mcp_root: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\mcp_master",
                 snapshot_dir: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\mcp_master\\_mahoraga_sys\\snapshot_initial",
                 recovery_dir: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\mcp_master\\_mahoraga_sys\\recovered"):
        self.mcp_root = Path(mcp_root)
        self.snapshot_dir = Path(snapshot_dir)
        self.recovery_dir = Path(recovery_dir)
        self.recovery_dir.mkdir(parents=True, exist_ok=True)
        
        self.adaptation_log = self.mcp_root / "_mahoraga_sys" / "adaptation_log.yaml"
        self.inventory_file = self.mcp_root / "_mahoraga_sys" / "tool_inventory.json"
        
        self.failure_history = []
        
    def handle_tool_failure(self, tool_name: str, error: Exception, tool_path: Optional[str] = None) -> Dict:
        """Handle a tool failure and attempt recovery."""
        timestamp = datetime.now().isoformat()
        
        # Create failure signature
        failure_sig = self._create_failure_signature(error)
        
        # Log the failure
        record = FailureRecord(
            timestamp=timestamp,
            tool_name=tool_name,
            failure_signature=failure_sig,
            action_taken="analyzing",
            success=False,
            details=str(error)
        )
        
        # Check for known patterns
        pattern_match = self._check_pattern_match(failure_sig)
        
        if pattern_match:
            # Apply known fix
            result = self._apply_known_fix(tool_name, pattern_match, tool_path)
        else:
            # Attempt rollback
            result = self._rollback_tool(tool_name, tool_path)
        
        # Update record
        record.action_taken = result.get("action", "unknown")
        record.success = result.get("success", False)
        
        # Add to history
        self.failure_history.append(record)
        
        # Log adaptation
        self._log_adaptation(record)
        
        return {
            "success": record.success,
            "action": record.action_taken,
            "details": result.get("details", ""),
            "pattern_match": pattern_match is not None
        }
    
    def _create_failure_signature(self, error: Exception) -> str:
        """Create a signature for the failure type."""
        error_type = type(error).__name__
        error_msg = str(error)
        
        # Simplify common patterns
        if "ImportError" in error_type or "ModuleNotFoundError" in error_type:
            # Extract module name
            if "'" in error_msg:
                module = error_msg.split("'")[1] if "'" in error_msg else "unknown"
                return f"ImportError:{module}"
            return f"ImportError:unknown"
        
        elif "SyntaxError" in error_type:
            return "SyntaxError"
        
        elif "TimeoutError" in error_type:
            return "TimeoutError"
        
        elif "ConnectionError" in error_type or "RequestException" in error_type:
            return "ConnectionError"
        
        else:
            return f"{error_type}:{error_msg[:50]}"
    
    def _check_pattern_match(self, failure_sig: str) -> Optional[Dict]:
        """Check if failure signature matches a known pattern."""
        try:
            import yaml
            with open(self.adaptation_log, 'r', encoding='utf-8') as f:
                log_data = yaml.safe_load(f) or {}
            
            patterns = log_data.get("patterns", [])
            for pattern in patterns:
                if pattern.get("signature") == failure_sig:
                    return pattern
            
        except Exception:
            pass
        
        return None
    
    def _apply_known_fix(self, tool_name: str, pattern: Dict, tool_path: Optional[str]) -> Dict:
        """Apply a known fix for a failure pattern."""
        fix_template = pattern.get("fix_template", "")
        
        if "pip install" in fix_template:
            # Extract missing module
            missing_module = fix_template.split("{")[1].split("}")[0] if "{" in fix_template else None
            
            if missing_module:
                try:
                    import subprocess
                    result = subprocess.run(
                        [sys.executable, "-m", "pip", "install", missing_module],
                        capture_output=True, text=True, timeout=60
                    )
                    
                    if result.returncode == 0:
                        return {
                            "action": "installed_dependency",
                            "success": True,
                            "details": f"Installed {missing_module}"
                        }
                except Exception as e:
                    return {
                        "action": "fix_failed",
                        "success": False,
                        "details": f"Failed to install {missing_module}: {e}"
                    }
        
        return {
            "action": "no_fix_available",
            "success": False,
            "details": "Known pattern but no automated fix available"
        }
    
    def _rollback_tool(self, tool_name: str, tool_path: Optional[str]) -> Dict:
        """Rollback tool to last known good snapshot."""
        if not tool_path:
            tool_path = str(self.mcp_root / "tools" / "ingested" / tool_name)
        
        tool_path = Path(tool_path)
        
        # Find snapshot
        snapshot_path = self.snapshot_dir / tool_path.relative_to(self.mcp_root)
        
        if not snapshot_path.exists():
            return {
                "action": "rollback_failed",
                "success": False,
                "details": "No snapshot available for rollback"
            }
        
        try:
            # Quarantine current version
            if tool_path.exists():
                quarantine_path = self.mcp_root / "_mahoraga_sys" / "quarantine_critical" / f"{tool_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                shutil.move(str(tool_path), str(quarantine_path))
            
            # Restore from snapshot
            shutil.copytree(snapshot_path, tool_path)
            
            return {
                "action": "rollback",
                "success": True,
                "details": f"Rolled back {tool_name} to snapshot"
            }
            
        except Exception as e:
            return {
                "action": "rollback_failed",
                "success": False,
                "details": f"Rollback failed: {e}"
            }
    
    def _log_adaptation(self, record: FailureRecord):
        """Log adaptation to YAML file."""
        try:
            import yaml
            
            # Load existing log
            if self.adaptation_log.exists():
                with open(self.adaptation_log, 'r', encoding='utf-8') as f:
                    log_data = yaml.safe_load(f) or {}
            else:
                log_data = {
                    "metadata": {
                        "server_name": "Mahoraga",
                        "created": datetime.now().isoformat(),
                        "purpose": "Self-healing pattern learning and adaptation tracking"
                    },
                    "adaptations": [],
                    "patterns": [],
                    "stats": {
                        "total_adaptations": 0,
                        "successful_regenerations": 0,
                        "rollbacks_performed": 0,
                        "patterns_learned": 0,
                        "last_updated": datetime.now().isoformat()
                    }
                }
            
            # Add adaptation entry
            entry = {
                "timestamp": record.timestamp,
                "tool_name": record.tool_name,
                "failure_signature": record.failure_signature,
                "action": record.action_taken,
                "success": record.success,
                "details": record.details
            }
            
            log_data["adaptations"].append(entry)
            log_data["stats"]["total_adaptations"] = len(log_data["adaptations"])
            log_data["stats"]["last_updated"] = datetime.now().isoformat()
            
            if record.action_taken == "rollback":
                log_data["stats"]["rollbacks_performed"] += 1
            
            # Save
            with open(self.adaptation_log, 'w', encoding='utf-8') as f:
                yaml.dump(log_data, f, default_flow_style=False)
                
        except Exception as e:
            print(f"Failed to log adaptation: {e}")
    
    def learn_pattern(self, failure_sig: str, fix_template: str) -> bool:
        """Learn a new failure pattern."""
        try:
            import yaml
            
            with open(self.adaptation_log, 'r', encoding='utf-8') as f:
                log_data = yaml.safe_load(f) or {}
            
            # Check if pattern already exists
            patterns = log_data.get("patterns", [])
            for p in patterns:
                if p.get("signature") == failure_sig:
                    return False
            
            # Add new pattern
            new_pattern = {
                "signature": failure_sig,
                "fix_template": fix_template,
                "success_count": 0,
                "last_seen": datetime.now().isoformat()
            }
            
            patterns.append(new_pattern)
            log_data["patterns"] = patterns
            log_data["stats"]["patterns_learned"] = len(patterns)
            log_data["stats"]["last_updated"] = datetime.now().isoformat()
            
            with open(self.adaptation_log, 'w', encoding='utf-8') as f:
                yaml.dump(log_data, f, default_flow_style=False)
            
            return True
            
        except Exception as e:
            print(f"Failed to learn pattern: {e}")
            return False
