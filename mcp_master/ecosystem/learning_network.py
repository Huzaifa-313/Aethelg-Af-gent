#!/usr/bin/env python3
"""
MCP MASTER - CROSS-AGENT LEARNING NETWORK
=========================================
Extracts patterns from agent interactions and shares knowledge
across the ecosystem to improve tool selection and performance.

Responsibilities:
- Extract patterns from successful agent interactions
- Share knowledge across agents
- Improve tool selection based on historical data
- Build intelligence database over time
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from collections import defaultdict
import yaml

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))


@dataclass
class LearnedPattern:
    """Represents a learned pattern from agent interactions."""
    pattern_id: str
    pattern_type: str  # 'tool_selection', 'query_understanding', 'error_recovery'
    description: str
    frequency: int
    confidence: float
    examples: List[str]
    created_at: str
    last_seen: str


class LearningNetwork:
    """
    Cross-Agent Learning Network for the MCP Master ecosystem.
    
    Extracts patterns from agent interactions and shares
    knowledge across the ecosystem.
    """
    
    def __init__(self, config_path: str = "./ecosystem_config.yaml"):
        """Initialize the Learning Network."""
        self.config = self._load_config(config_path)
        self.learning_config = self.config.get("learning_network", {})
        self.master_dir = Path(self.config.get("paths", {}).get("master_dir", "./"))
        self.intelligence_file = Path(self.config.get("paths", {}).get("intelligence_file", "./ecosystem/intelligence.json"))
        
        # Ensure directories exist
        self.intelligence_file.parent.mkdir(parents=True, exist_ok=True)
        
        # State
        self.patterns: Dict[str, LearnedPattern] = {}
        self.tool_success_rates: Dict[str, Dict] = defaultdict(lambda: {"success": 0, "total": 0})
        self.query_patterns: Dict[str, List[str]] = defaultdict(list)
        
        # Load existing intelligence
        self._load_intelligence()
        
        print("[LearningNetwork] Initialized")
    
    def _load_config(self, config_path: str) -> Dict:
        """Load configuration from YAML file."""
        try:
            with open(config_path, 'r') as f:
                return yaml.safe_load(f).get("ecosystem", {})
        except Exception as e:
            print(f"[LearningNetwork] Warning: Could not load config: {e}")
            return {}
    
    def _load_intelligence(self):
        """Load existing intelligence from disk."""
        if self.intelligence_file.exists():
            try:
                with open(self.intelligence_file, 'r') as f:
                    data = json.load(f)
                
                for pattern_data in data.get("patterns", []):
                    pattern = LearnedPattern(**pattern_data)
                    self.patterns[pattern.pattern_id] = pattern
                
                self.tool_success_rates = defaultdict(lambda: {"success": 0, "total": 0}, data.get("tool_success_rates", {}))
                self.query_patterns = defaultdict(list, data.get("query_patterns", {}))
                
                print(f"[LearningNetwork] Loaded {len(self.patterns)} patterns")
            except Exception as e:
                print(f"[LearningNetwork] Warning: Could not load intelligence: {e}")
    
    def _save_intelligence(self):
        """Save intelligence to disk."""
        try:
            data = {
                "last_updated": datetime.now().isoformat(),
                "patterns": [asdict(p) for p in self.patterns.values()],
                "tool_success_rates": dict(self.tool_success_rates),
                "query_patterns": dict(self.query_patterns)
            }
            
            with open(self.intelligence_file, 'w') as f:
                json.dump(data, f, indent=2)
                
        except Exception as e:
            print(f"[LearningNetwork] Warning: Could not save intelligence: {e}")
    
    def record_interaction(self, query: str, tools_used: List[str], 
                          success: bool, response_time: float = 0):
        """
        Record an agent interaction for pattern learning.
        
        Args:
            query: The original query
            tools_used: List of tools used
            success: Whether the interaction was successful
            response_time: Response time in seconds
        """
        # Update tool success rates
        for tool in tools_used:
            self.tool_success_rates[tool]["total"] += 1
            if success:
                self.tool_success_rates[tool]["success"] += 1
        
        # Extract query patterns
        query_lower = query.lower()
        words = query_lower.split()
        
        # Simple pattern extraction: store query words mapped to tools
        for tool in tools_used:
            self.query_patterns[tool].extend(words)
            # Keep only recent patterns
            self.query_patterns[tool] = self.query_patterns[tool][-100:]
        
        # Check for new patterns
        self._extract_patterns(query, tools_used, success)
        
        # Save intelligence
        self._save_intelligence()
    
    def _extract_patterns(self, query: str, tools_used: List[str], success: bool):
        """Extract patterns from an interaction."""
        # Tool selection pattern
        if len(tools_used) > 1:
            pattern_id = f"tool_combo_{'_'.join(sorted(tools_used))}"
            if pattern_id not in self.patterns:
                pattern = LearnedPattern(
                    pattern_id=pattern_id,
                    pattern_type="tool_selection",
                    description=f"Tools often used together: {', '.join(tools_used)}",
                    frequency=1,
                    confidence=0.5 if success else 0.3,
                    examples=[query],
                    created_at=datetime.now().isoformat(),
                    last_seen=datetime.now().isoformat()
                )
                self.patterns[pattern_id] = pattern
            else:
                self.patterns[pattern_id].frequency += 1
                self.patterns[pattern_id].last_seen = datetime.now().isoformat()
                if success:
                    self.patterns[pattern_id].confidence = min(1.0, self.patterns[pattern_id].confidence + 0.05)
        
        # Query understanding pattern
        if success and len(query) > 10:
            # Extract key terms
            key_terms = [word for word in query.lower().split() if len(word) > 3]
            if key_terms:
                pattern_id = f"query_{'_'.join(key_terms[:3])}"
                if pattern_id not in self.patterns:
                    pattern = LearnedPattern(
                        pattern_id=pattern_id,
                        pattern_type="query_understanding",
                        description=f"Query pattern: {query[:50]}...",
                        frequency=1,
                        confidence=0.5,
                        examples=[query],
                        created_at=datetime.now().isoformat(),
                        last_seen=datetime.now().isoformat()
                    )
                    self.patterns[pattern_id] = pattern
                else:
                    self.patterns[pattern_id].frequency += 1
                    self.patterns[pattern_id].last_seen = datetime.now().isoformat()
    
    def get_tool_recommendations(self, query: str) -> List[Dict]:
        """
        Get tool recommendations based on learned patterns.
        
        Args:
            query: The current query
            
        Returns:
            List of recommended tools with confidence scores
        """
        recommendations = []
        query_lower = query.lower()
        query_words = set(query_lower.split())
        
        # Check query patterns for each tool
        for tool, patterns in self.query_patterns.items():
            pattern_words = set(patterns)
            overlap = query_words & pattern_words
            
            if overlap:
                success_rate = self.tool_success_rates.get(tool, {"success": 0, "total": 1})
                confidence = len(overlap) / len(query_words) if query_words else 0
                
                recommendations.append({
                    "tool": tool,
                    "confidence": round(confidence, 2),
                    "success_rate": round(success_rate["success"] / max(success_rate["total"], 1), 2)
                })
        
        # Sort by confidence
        recommendations.sort(key=lambda x: x["confidence"], reverse=True)
        return recommendations[:5]
    
    def get_learned_patterns(self, pattern_type: Optional[str] = None) -> List[Dict]:
        """
        Get learned patterns.
        
        Args:
            pattern_type: Optional filter by pattern type
            
        Returns:
            List of patterns
        """
        patterns = self.patterns.values()
        
        if pattern_type:
            patterns = [p for p in patterns if p.pattern_type == pattern_type]
        
        # Sort by frequency and confidence
        patterns = sorted(patterns, key=lambda p: (p.frequency, p.confidence), reverse=True)
        
        return [asdict(p) for p in patterns]
    
    def get_intelligence_summary(self) -> Dict:
        """Get a summary of the intelligence database."""
        return {
            "total_patterns": len(self.patterns),
            "pattern_types": defaultdict(int),
            "tool_success_rates": dict(self.tool_success_rates),
            "total_queries_learned": sum(len(v) for v in self.query_patterns.values())
        }
    
    def share_knowledge(self, other_network: 'LearningNetwork') -> Dict:
        """
        Share knowledge with another learning network.
        
        Args:
            other_network: Another LearningNetwork instance
            
        Returns:
            Sharing results
        """
        shared_patterns = 0
        
        for pattern_id, pattern in other_network.patterns.items():
            if pattern_id not in self.patterns:
                self.patterns[pattern_id] = pattern
                shared_patterns += 1
            else:
                # Merge frequencies
                self.patterns[pattern_id].frequency += pattern.frequency
                self.patterns[pattern_id].confidence = max(
                    self.patterns[pattern_id].confidence,
                    pattern.confidence
                )
        
        self._save_intelligence()
        
        return {
            "shared_patterns": shared_patterns,
            "total_patterns": len(self.patterns)
        }


def main():
    """CLI entry point for the Learning Network."""
    network = LearningNetwork()
    
    import argparse
    parser = argparse.ArgumentParser(description="MCP Master Learning Network")
    parser.add_argument("command", choices=["record", "recommend", "patterns", "summary"])
    parser.add_argument("--query", help="Query to process")
    parser.add_argument("--tools", help="Comma-separated list of tools used")
    parser.add_argument("--success", type=bool, default=True, help="Whether the interaction was successful")
    
    args = parser.parse_args()
    
    if args.command == "record":
        if not args.query:
            print("Error: --query required")
            return
        
        tools = args.tools.split(",") if args.tools else []
        network.record_interaction(args.query, tools, args.success)
        print("Interaction recorded successfully")
    
    elif args.command == "recommend":
        if not args.query:
            print("Error: --query required")
            return
        
        recommendations = network.get_tool_recommendations(args.query)
        print(json.dumps(recommendations, indent=2))
    
    elif args.command == "patterns":
        patterns = network.get_learned_patterns()
        print(json.dumps(patterns, indent=2))
    
    elif args.command == "summary":
        print(json.dumps(network.get_intelligence_summary(), indent=2))


if __name__ == "__main__":
    main()
