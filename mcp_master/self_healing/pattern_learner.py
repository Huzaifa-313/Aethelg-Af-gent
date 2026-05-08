# Mahoraga MCP Server - Pattern Learner
# Learns from failure patterns to preemptively harden tools

import yaml
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional, List

class PatternLearner:
    """Learns and manages failure patterns for self-healing."""
    
    def __init__(self, 
                 adaptation_log: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\mcp_master\\_mahoraga_sys\\adaptation_log.yaml"):
        self.adaptation_log = Path(adaptation_log)
        
    def learn_from_failure(self, failure_sig: str, action_taken: str, success: bool) -> bool:
        """Learn a new failure pattern or update existing one."""
        try:
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
            
            # Check if pattern exists
            patterns = log_data.get("patterns", [])
            existing_pattern = None
            
            for pattern in patterns:
                if pattern.get("signature") == failure_sig:
                    existing_pattern = pattern
                    break
            
            if existing_pattern:
                # Update existing pattern
                existing_pattern["last_seen"] = datetime.now().isoformat()
                if success:
                    existing_pattern["success_count"] = existing_pattern.get("success_count", 0) + 1
                else:
                    existing_pattern["failure_count"] = existing_pattern.get("failure_count", 0) + 1
            else:
                # Create new pattern
                new_pattern = {
                    "signature": failure_sig,
                    "action_template": action_taken,
                    "success_count": 1 if success else 0,
                    "failure_count": 0 if success else 1,
                    "last_seen": datetime.now().isoformat(),
                    "created": datetime.now().isoformat()
                }
                patterns.append(new_pattern)
                log_data["stats"]["patterns_learned"] = len(patterns)
            
            # Update stats
            log_data["stats"]["last_updated"] = datetime.now().isoformat()
            
            # Save
            with open(self.adaptation_log, 'w', encoding='utf-8') as f:
                yaml.dump(log_data, f, default_flow_style=False)
            
            return True
            
        except Exception as e:
            print(f"Failed to learn pattern: {e}")
            return False
    
    def get_pattern(self, failure_sig: str) -> Optional[Dict]:
        """Retrieve a learned pattern by signature."""
        try:
            if not self.adaptation_log.exists():
                return None
            
            with open(self.adaptation_log, 'r', encoding='utf-8') as f:
                log_data = yaml.safe_load(f) or {}
            
            patterns = log_data.get("patterns", [])
            for pattern in patterns:
                if pattern.get("signature") == failure_sig:
                    return pattern
            
            return None
            
        except Exception as e:
            print(f"Failed to get pattern: {e}")
            return None
    
    def get_all_patterns(self) -> List[Dict]:
        """Get all learned patterns."""
        try:
            if not self.adaptation_log.exists():
                return []
            
            with open(self.adaptation_log, 'r', encoding='utf-8') as f:
                log_data = yaml.safe_load(f) or {}
            
            return log_data.get("patterns", [])
            
        except Exception as e:
            print(f"Failed to get patterns: {e}")
            return []
    
    def get_stats(self) -> Dict:
        """Get pattern learning statistics."""
        try:
            if not self.adaptation_log.exists():
                return {
                    "total_patterns": 0,
                    "successful_patterns": 0,
                    "failed_patterns": 0
                }
            
            with open(self.adaptation_log, 'r', encoding='utf-8') as f:
                log_data = yaml.safe_load(f) or {}
            
            patterns = log_data.get("patterns", [])
            stats = log_data.get("stats", {})
            
            return {
                "total_patterns": len(patterns),
                "successful_patterns": sum(1 for p in patterns if p.get("success_count", 0) > 0),
                "failed_patterns": sum(1 for p in patterns if p.get("failure_count", 0) > 0),
                "total_adaptations": stats.get("total_adaptations", 0),
                "patterns_learned": stats.get("patterns_learned", 0),
                "last_updated": stats.get("last_updated", "")
            }
            
        except Exception as e:
            print(f"Failed to get stats: {e}")
            return {}
