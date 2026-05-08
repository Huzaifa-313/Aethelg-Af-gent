#!/usr/bin/env python3
"""
MCP MASTER - NEED DETECTION ENGINE
==================================
Analyzes agent interactions and tool usage patterns to detect
capability gaps and missing tools in the ecosystem.

Responsibilities:
- Monitor agent interactions for unfulfilled requests
- Analyze tool usage patterns to identify gaps
- Maintain a prioritized list of missing capabilities
- Trigger tool hunting when gaps are detected
"""

import json
import re
import os
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Any, Set
from dataclasses import dataclass, asdict
from collections import defaultdict
import yaml

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))


@dataclass
class CapabilityGap:
    """Represents a detected capability gap."""
    gap_id: str
    description: str
    category: str
    confidence: float
    detected_at: str
    source: str  # 'agent_request', 'usage_pattern', 'manual'
    frequency: int
    related_keywords: List[str]
    priority: str  # 'low', 'medium', 'high', 'critical'
    status: str  # 'open', 'hunting', 'resolved', 'rejected'


class NeedDetector:
    """
    Need Detection Engine for the MCP Master ecosystem.
    
    Monitors agent interactions and tool usage to identify
    missing capabilities and trigger tool discovery.
    """
    
    def __init__(self, config_path: str = "./ecosystem_config.yaml"):
        """Initialize the Need Detector."""
        self.config = self._load_config(config_path)
        self.master_dir = Path(self.config.get("paths", {}).get("master_dir", "./"))
        self.gaps_file = Path(self.config.get("paths", {}).get("gaps_file", "./ecosystem/gaps.json"))
        self.registry_file = Path(self.config.get("paths", {}).get("registry_file", "./registry/tool_registry.json"))
        
        # Ensure directories exist
        self.gaps_file.parent.mkdir(parents=True, exist_ok=True)
        
        # State
        self.gaps: Dict[str, CapabilityGap] = {}
        self.tool_keywords: Dict[str, List[str]] = {}
        self.interaction_history: List[Dict] = []
        
        # Load existing state
        self._load_state()
        self._load_registry_tools()
    
    def _load_config(self, config_path: str) -> Dict:
        """Load configuration from YAML file."""
        try:
            with open(config_path, 'r') as f:
                return yaml.safe_load(f).get("ecosystem", {})
        except Exception as e:
            print(f"[NeedDetector] Warning: Could not load config: {e}")
            return {}
    
    def _load_state(self):
        """Load existing gaps from disk."""
        if self.gaps_file.exists():
            try:
                with open(self.gaps_file, 'r') as f:
                    gaps_data = json.load(f)
                for gap_data in gaps_data.get("gaps", []):
                    gap = CapabilityGap(**gap_data)
                    self.gaps[gap.gap_id] = gap
                print(f"[NeedDetector] Loaded {len(self.gaps)} existing gaps")
            except Exception as e:
                print(f"[NeedDetector] Warning: Could not load gaps: {e}")
    
    def _save_state(self):
        """Save gaps to disk."""
        try:
            gaps_data = {
                "last_updated": datetime.now().isoformat(),
                "gaps": [asdict(gap) for gap in self.gaps.values()]
            }
            with open(self.gaps_file, 'w') as f:
                json.dump(gaps_data, f, indent=2)
        except Exception as e:
            print(f"[NeedDetector] Warning: Could not save gaps: {e}")
    
    def _load_registry_tools(self):
        """Load existing tools from registry for keyword matching."""
        if self.registry_file.exists():
            try:
                with open(self.registry_file, 'r') as f:
                    registry = json.load(f)
                
                for tool_name, tool_data in registry.get("tools", {}).items():
                    keywords = tool_data.get("keywords", [])
                    self.tool_keywords[tool_name] = [k.lower() for k in keywords]
                
                print(f"[NeedDetector] Loaded {len(self.tool_keywords)} tools from registry")
            except Exception as e:
                print(f"[NeedDetector] Warning: Could not load registry: {e}")
    
    def analyze_interaction(self, interaction: Dict[str, Any]) -> List[CapabilityGap]:
        """
        Analyze an agent interaction to detect capability gaps.
        
        Args:
            interaction: Dictionary containing interaction data
                {
                    "query": str,
                    "agent": str,
                    "timestamp": str,
                    "tools_used": List[str],
                    "success": bool,
                    "error_message": str (optional)
                }
                
        Returns:
            List of detected gaps
        """
        detected_gaps = []
        
        # Check for failed interactions with error messages
        if not interaction.get("success", True):
            gap = self._analyze_failure(interaction)
            if gap:
                detected_gaps.append(gap)
        
        # Check for tool usage patterns
        pattern_gaps = self._analyze_usage_patterns(interaction)
        detected_gaps.extend(pattern_gaps)
        
        # Check for keyword-based gaps
        keyword_gaps = self._analyze_keywords(interaction)
        detected_gaps.extend(keyword_gaps)
        
        # Save updated state
        self._save_state()
        
        return detected_gaps
    
    def _analyze_failure(self, interaction: Dict) -> Optional[CapabilityGap]:
        """Analyze a failed interaction to detect gaps."""
        error_msg = interaction.get("error_message", "").lower()
        query = interaction.get("query", "").lower()
        
        # Common failure patterns that indicate missing tools
        failure_patterns = {
            "database": ["database", "sql", "query", "db", "postgres", "mysql", "sqlite"],
            "web_scraping": ["scrape", "crawl", "web", "html", "browser"],
            "api_integration": ["api", "endpoint", "rest", "graphql", "webhook"],
            "file_processing": ["pdf", "csv", "excel", "document", "parse"],
            "machine_learning": ["model", "predict", "classify", "ml", "ai"],
            "natural_language": ["nlp", "sentiment", "translate", "summarize"],
            "automation": ["automate", "schedule", "cron", "workflow"],
            "security": ["encrypt", "hash", "secure", "auth", "password"],
            "monitoring": ["monitor", "alert", "metric", "log", "trace"],
            "cloud": ["aws", "azure", "gcp", "cloud", "s3", "bucket"]
        }
        
        for category, keywords in failure_patterns.items():
            for keyword in keywords:
                if keyword in error_msg or keyword in query:
                    gap_id = f"gap_{category}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                    
                    gap = CapabilityGap(
                        gap_id=gap_id,
                        description=f"Missing {category} capability detected from failed interaction",
                        category=category,
                        confidence=0.8,
                        detected_at=datetime.now().isoformat(),
                        source="agent_request",
                        frequency=1,
                        related_keywords=[keyword],
                        priority="high",
                        status="open"
                    )
                    
                    # Check if similar gap already exists
                    existing = self._find_similar_gap(gap)
                    if existing:
                        existing.frequency += 1
                        existing.confidence = min(1.0, existing.confidence + 0.1)
                        return existing
                    
                    self.gaps[gap_id] = gap
                    print(f"[NeedDetector] New gap detected: {gap_id} ({category})")
                    return gap
        
        return None
    
    def _analyze_usage_patterns(self, interaction: Dict) -> List[CapabilityGap]:
        """Analyze tool usage patterns to detect gaps."""
        gaps = []
        tools_used = interaction.get("tools_used", [])
        query = interaction.get("query", "").lower()
        
        # Check for common tool combinations that suggest missing tools
        tool_combinations = {
            ("filesystem", "fetch"): "web_scraping",
            ("fetch", "filesystem"): "web_scraping",
            ("memory", "fetch"): "data_processing",
            ("filesystem", "memory"): "data_processing",
        }
        
        tools_tuple = tuple(sorted(tools_used))
        if tools_tuple in tool_combinations:
            category = tool_combinations[tools_tuple]
            gap_id = f"gap_{category}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            
            gap = CapabilityGap(
                gap_id=gap_id,
                description=f"Missing {category} tool detected from usage pattern",
                category=category,
                confidence=0.6,
                detected_at=datetime.now().isoformat(),
                source="usage_pattern",
                frequency=1,
                related_keywords=list(tools_used),
                priority="medium",
                status="open"
            )
            
            existing = self._find_similar_gap(gap)
            if existing:
                existing.frequency += 1
                return [existing]
            
            self.gaps[gap_id] = gap
            gaps.append(gap)
        
        return gaps
    
    def _analyze_keywords(self, interaction: Dict) -> List[CapabilityGap]:
        """Analyze query keywords to detect potential gaps."""
        gaps = []
        query = interaction.get("query", "").lower()
        
        # Keywords that suggest specific tool needs
        keyword_categories = {
            "database": ["database", "sql", "query", "table", "schema", "migration"],
            "web_scraping": ["scrape", "crawl", "extract", "html", "web page"],
            "api_integration": ["api", "endpoint", "integration", "webhook"],
            "file_processing": ["parse", "convert", "extract", "pdf", "csv", "excel"],
            "machine_learning": ["predict", "classify", "cluster", "model", "train"],
            "natural_language": ["summarize", "translate", "sentiment", "nlp"],
            "automation": ["automate", "schedule", "cron", "workflow", "pipeline"],
            "security": ["encrypt", "hash", "secure", "authenticate", "authorize"],
            "monitoring": ["monitor", "alert", "metric", "dashboard", "observability"],
            "cloud": ["aws", "azure", "gcp", "cloud", "s3", "lambda"]
        }
        
        for category, keywords in keyword_categories.items():
            for keyword in keywords:
                if keyword in query:
                    # Check if we already have a tool for this category
                    has_tool = any(category in kw for tool_kws in self.tool_keywords.values() 
                                  for kw in tool_kws)
                    
                    if not has_tool:
                        gap_id = f"gap_{category}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                        
                        gap = CapabilityGap(
                            gap_id=gap_id,
                            description=f"Missing {category} capability suggested by query keywords",
                            category=category,
                            confidence=0.7,
                            detected_at=datetime.now().isoformat(),
                            source="usage_pattern",
                            frequency=1,
                            related_keywords=[keyword],
                            priority="medium",
                            status="open"
                        )
                        
                        existing = self._find_similar_gap(gap)
                        if existing:
                            existing.frequency += 1
                            return [existing]
                        
                        self.gaps[gap_id] = gap
                        gaps.append(gap)
                        break  # Only create one gap per category
        
        return gaps
    
    def _find_similar_gap(self, gap: CapabilityGap) -> Optional[CapabilityGap]:
        """Find a similar existing gap."""
        for existing in self.gaps.values():
            if (existing.category == gap.category and 
                existing.status == "open" and
                any(kw in existing.related_keywords for kw in gap.related_keywords)):
                return existing
        return None
    
    def get_open_gaps(self, min_confidence: float = 0.0) -> List[CapabilityGap]:
        """
        Get all open gaps above a confidence threshold.
        
        Args:
            min_confidence: Minimum confidence score (0.0 to 1.0)
            
        Returns:
            List of open gaps
        """
        return [
            gap for gap in self.gaps.values()
            if gap.status == "open" and gap.confidence >= min_confidence
        ]
    
    def get_priority_gaps(self) -> List[CapabilityGap]:
        """Get gaps sorted by priority and frequency."""
        priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        
        open_gaps = self.get_open_gaps()
        return sorted(
            open_gaps,
            key=lambda g: (priority_order.get(g.priority, 4), -g.frequency, -g.confidence)
        )
    
    def mark_gap_status(self, gap_id: str, status: str) -> bool:
        """
        Mark a gap's status.
        
        Args:
            gap_id: ID of the gap
            status: New status ('open', 'hunting', 'resolved', 'rejected')
            
        Returns:
            True if successful
        """
        if gap_id in self.gaps:
            self.gaps[gap_id].status = status
            self._save_state()
            print(f"[NeedDetector] Gap {gap_id} marked as {status}")
            return True
        return False
    
    def get_gap_summary(self) -> Dict:
        """Get a summary of all gaps."""
        open_gaps = self.get_open_gaps()
        
        return {
            "total_gaps": len(self.gaps),
            "open_gaps": len(open_gaps),
            "by_category": defaultdict(int),
            "by_priority": defaultdict(int),
            "top_gaps": [asdict(gap) for gap in self.get_priority_gaps()[:10]]
        }
    
    def generate_gap_report(self) -> Dict:
        """Generate a comprehensive gap analysis report."""
        return {
            "generated_at": datetime.now().isoformat(),
            "summary": self.get_gap_summary(),
            "open_gaps": [asdict(gap) for gap in self.get_open_gaps()],
            "priority_gaps": [asdict(gap) for gap in self.get_priority_gaps()],
            "total_interactions_analyzed": len(self.interaction_history)
        }


def main():
    """CLI entry point for the Need Detector."""
    detector = NeedDetector()
    
    import argparse
    parser = argparse.ArgumentParser(description="MCP Master Need Detector")
    parser.add_argument("command", choices=["analyze", "gaps", "report", "mark"])
    parser.add_argument("--query", help="Query to analyze")
    parser.add_argument("--agent", help="Agent name")
    parser.add_argument("--tools", help="Comma-separated list of tools used")
    parser.add_argument("--success", type=bool, default=True, help="Whether the interaction was successful")
    parser.add_argument("--error", help="Error message if failed")
    parser.add_argument("--gap-id", help="Gap ID to mark")
    parser.add_argument("--status", choices=["open", "hunting", "resolved", "rejected"], help="New status")
    
    args = parser.parse_args()
    
    if args.command == "analyze":
        interaction = {
            "query": args.query or "",
            "agent": args.agent or "unknown",
            "timestamp": datetime.now().isoformat(),
            "tools_used": (args.tools or "").split(","),
            "success": args.success,
            "error_message": args.error or ""
        }
        gaps = detector.analyze_interaction(interaction)
        print(f"Detected {len(gaps)} gaps")
        for gap in gaps:
            print(f"  - {gap.gap_id}: {gap.description}")
    
    elif args.command == "gaps":
        gaps = detector.get_priority_gaps()
        print(f"Found {len(gaps)} priority gaps:")
        for gap in gaps:
            print(f"  [{gap.priority}] {gap.gap_id}: {gap.description} (confidence: {gap.confidence:.2f})")
    
    elif args.command == "report":
        print(json.dumps(detector.generate_gap_report(), indent=2))
    
    elif args.command == "mark":
        if not args.gap_id or not args.status:
            print("Error: --gap-id and --status required")
            return
        success = detector.mark_gap_status(args.gap_id, args.status)
        print(f"Marked gap {args.gap_id} as {args.status}: {success}")


if __name__ == "__main__":
    main()
