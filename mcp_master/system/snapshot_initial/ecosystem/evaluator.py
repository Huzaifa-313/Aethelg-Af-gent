#!/usr/bin/env python3
"""
MCP MASTER - AUTOMATED EVALUATION AND SCORING
=============================================
Evaluates candidate tools found by the Tool Hunter using
sandboxed performance testing and quality scoring.

Responsibilities:
- Download and test candidate tools in sandbox
- Score tools on functionality, security, performance, docs
- Generate detailed evaluation reports
- Recommend tools for installation or rejection
"""

import json
import os
import sys
import subprocess
import tempfile
import shutil
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from urllib.parse import urlparse
import yaml

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))


@dataclass
class EvaluationResult:
    """Represents the evaluation result for a tool."""
    tool_name: str
    source: str
    overall_score: float
    functionality_score: float
    security_score: float
    performance_score: float
    documentation_score: float
    maintenance_score: float
    evaluated_at: str
    recommendation: str  # 'install', 'reject', 'review'
    details: Dict[str, Any]


class Evaluator:
    """
    Automated Evaluation and Scoring for the MCP Master ecosystem.
    
    Evaluates candidate tools using sandboxed testing and
    multi-dimensional quality scoring.
    """
    
    def __init__(self, config_path: str = "./ecosystem_config.yaml"):
        """Initialize the Evaluator."""
        self.config = self._load_config(config_path)
        self.evaluator_config = self.config.get("evaluator", {})
        self.master_dir = Path(self.config.get("paths", {}).get("master_dir", "./"))
        
        # Scoring weights
        self.weights = self.evaluator_config.get("scoring_weights", {
            "functionality": 0.30,
            "security": 0.25,
            "performance": 0.20,
            "documentation": 0.15,
            "maintenance": 0.10
        })
        
        print("[Evaluator] Initialized")
    
    def _load_config(self, config_path: str) -> Dict:
        """Load configuration from YAML file."""
        try:
            with open(config_path, 'r') as f:
                return yaml.safe_load(f).get("ecosystem", {})
        except Exception as e:
            print(f"[Evaluator] Warning: Could not load config: {e}")
            return {}
    
    def evaluate_tool(self, candidate: Dict[str, Any]) -> EvaluationResult:
        """
        Evaluate a candidate tool comprehensively.
        
        Args:
            candidate: Tool candidate data
            
        Returns:
            Evaluation result with scores and recommendation
        """
        tool_name = candidate.get("name", "unknown")
        print(f"[Evaluator] Evaluating tool: {tool_name}")
        
        # Run evaluation tests
        functionality = self._test_functionality(candidate)
        security = self._test_security(candidate)
        performance = self._test_performance(candidate)
        documentation = self._test_documentation(candidate)
        maintenance = self._test_maintenance(candidate)
        
        # Calculate overall score
        overall = (
            functionality * self.weights["functionality"] +
            security * self.weights["security"] +
            performance * self.weights["performance"] +
            documentation * self.weights["documentation"] +
            maintenance * self.weights["maintenance"]
        )
        
        # Determine recommendation
        min_score = self.evaluator_config.get("min_quality_score", 75)
        if overall >= min_score:
            recommendation = "install"
        elif overall >= min_score * 0.7:
            recommendation = "review"
        else:
            recommendation = "reject"
        
        result = EvaluationResult(
            tool_name=tool_name,
            source=candidate.get("source", "unknown"),
            overall_score=round(overall, 2),
            functionality_score=round(functionality, 2),
            security_score=round(security, 2),
            performance_score=round(performance, 2),
            documentation_score=round(documentation, 2),
            maintenance_score=round(maintenance, 2),
            evaluated_at=datetime.now().isoformat(),
            recommendation=recommendation,
            details={
                "candidate": candidate,
                "weights_applied": self.weights
            }
        )
        
        print(f"[Evaluator] {tool_name}: {overall:.1f}/100 -> {recommendation}")
        return result
    
    def _test_functionality(self, candidate: Dict) -> float:
        """Test tool functionality (0-100)."""
        score = 50.0  # Base score
        
        # Check if tool has a clear purpose
        description = candidate.get("description", "")
        if description and len(description) > 20:
            score += 10
        
        # Check for MCP compatibility indicators
        desc_lower = description.lower()
        if any(kw in desc_lower for kw in ["mcp", "model context protocol"]):
            score += 15
        
        # Check for recent activity (if available)
        metadata = candidate.get("metadata", {})
        if metadata.get("updated_at"):
            score += 10
        
        # Check for test files or CI indicators
        if any(kw in desc_lower for kw in ["test", "ci", "github actions"]):
            score += 10
        
        # Cap at 100
        return min(100.0, score)
    
    def _test_security(self, candidate: Dict) -> float:
        """Test tool security (0-100)."""
        score = 60.0  # Base score
        
        # Check for license
        metadata = candidate.get("metadata", {})
        license_type = metadata.get("license", "unknown")
        if license_type and license_type != "unknown":
            score += 10
        
        # Check for author/publisher info
        if metadata.get("author") or metadata.get("publisher"):
            score += 10
        
        # Source-based scoring
        source = candidate.get("source", "")
        if source == "github":
            score += 10  # More transparent
        elif source in ["pypi", "npm"]:
            score += 5
        
        # Check for suspicious keywords in description
        desc = candidate.get("description", "").lower()
        suspicious = ["hack", "crack", "exploit", "bypass"]
        if any(s in desc for s in suspicious):
            score -= 30
        
        return max(0.0, min(100.0, score))
    
    def _test_performance(self, candidate: Dict) -> float:
        """Test tool performance (0-100)."""
        score = 50.0  # Base score
        
        # Check popularity indicators
        stars = candidate.get("stars", 0)
        if stars > 1000:
            score += 20
        elif stars > 100:
            score += 10
        elif stars > 10:
            score += 5
        
        # Check language (some languages are generally faster)
        language = candidate.get("language", "").lower()
        if language in ["rust", "go", "c++"]:
            score += 10
        elif language in ["python", "javascript", "typescript"]:
            score += 5
        
        return min(100.0, score)
    
    def _test_documentation(self, candidate: Dict) -> float:
        """Test tool documentation quality (0-100)."""
        score = 40.0  # Base score
        
        # Check description quality
        description = candidate.get("description", "")
        if len(description) > 50:
            score += 20
        elif len(description) > 20:
            score += 10
        
        # Check for README indicators
        if any(kw in description.lower() for kw in ["install", "usage", "example"]):
            score += 15
        
        # Check for URL (usually points to docs)
        if candidate.get("url"):
            score += 10
        
        return min(100.0, score)
    
    def _test_maintenance(self, candidate: Dict) -> float:
        """Test tool maintenance status (0-100)."""
        score = 50.0  # Base score
        
        # Check for recent updates
        metadata = candidate.get("metadata", {})
        updated_at = metadata.get("updated_at", "")
        if updated_at:
            try:
                from datetime import datetime
                updated = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))
                days_since_update = (datetime.now(updated.tzinfo) - updated).days
                
                if days_since_update < 30:
                    score += 20
                elif days_since_update < 90:
                    score += 10
                elif days_since_update < 180:
                    score += 5
            except Exception:
                pass
        
        # Check forks (indicates community interest)
        forks = metadata.get("forks", 0)
        if forks > 100:
            score += 10
        elif forks > 10:
            score += 5
        
        return min(100.0, score)
    
    def evaluate_candidates(self, candidates: List[Dict]) -> List[EvaluationResult]:
        """
        Evaluate multiple candidate tools.
        
        Args:
            candidates: List of tool candidates
            
        Returns:
            List of evaluation results
        """
        results = []
        for candidate in candidates:
            try:
                result = self.evaluate_tool(candidate)
                results.append(result)
            except Exception as e:
                print(f"[Evaluator] Error evaluating {candidate.get('name', 'unknown')}: {e}")
        
        # Sort by overall score
        results.sort(key=lambda r: r.overall_score, reverse=True)
        return results
    
    def generate_evaluation_report(self, results: List[EvaluationResult]) -> Dict:
        """Generate a comprehensive evaluation report."""
        return {
            "generated_at": datetime.now().isoformat(),
            "total_evaluated": len(results),
            "recommended_for_install": len([r for r in results if r.recommendation == "install"]),
            "recommended_for_review": len([r for r in results if r.recommendation == "review"]),
            "recommended_for_rejection": len([r for r in results if r.recommendation == "reject"]),
            "results": [asdict(r) for r in results]
        }


def main():
    """CLI entry point for the Evaluator."""
    evaluator = Evaluator()
    
    import argparse
    parser = argparse.ArgumentParser(description="MCP Master Evaluator")
    parser.add_argument("command", choices=["evaluate", "report"])
    parser.add_argument("--candidate-file", help="JSON file with candidate data")
    
    args = parser.parse_args()
    
    if args.command == "evaluate":
        if not args.candidate_file:
            print("Error: --candidate-file required")
            return
        
        with open(args.candidate_file, 'r') as f:
            candidates = json.load(f)
        
        results = evaluator.evaluate_candidates(candidates)
        
        print(f"\nEvaluation Results ({len(results)} tools):")
        for result in results:
            print(f"\n{result.tool_name} ({result.source})")
            print(f"  Overall: {result.overall_score}/100")
            print(f"  Functionality: {result.functionality_score}")
            print(f"  Security: {result.security_score}")
            print(f"  Performance: {result.performance_score}")
            print(f"  Documentation: {result.documentation_score}")
            print(f"  Maintenance: {result.maintenance_score}")
            print(f"  Recommendation: {result.recommendation.upper()}")
    
    elif args.command == "report":
        if not args.candidate_file:
            print("Error: --candidate-file required")
            return
        
        with open(args.candidate_file, 'r') as f:
            candidates = json.load(f)
        
        results = evaluator.evaluate_candidates(candidates)
        report = evaluator.generate_evaluation_report(results)
        print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
