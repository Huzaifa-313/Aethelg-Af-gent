#!/usr/bin/env python3
"""
Enhanced Learning Network
Integrates OpenJarvis learning capabilities into mcp_master ecosystem.
Provides pattern learning, skill optimization, and cross-agent knowledge sharing.
"""

from __future__ import annotations

import json
import logging
import time
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Base Types
# ---------------------------------------------------------------------------

@dataclass
class LearnedPattern:
    """A pattern learned from agent interactions."""
    pattern_type: str
    pattern: str
    frequency: int
    success_rate: float
    last_used: float
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class SkillOptimization:
    """Skill optimization result."""
    skill_name: str
    status: str
    trace_count: int
    improvement: float = 0.0


# ---------------------------------------------------------------------------
# Enhanced Learning Network
# ---------------------------------------------------------------------------

class EnhancedLearningNetwork:
    """Enhanced learning network with OpenJarvis capabilities.
    
    Provides:
    - Pattern learning from agent interactions
    - Skill optimization
    - Cross-agent knowledge sharing
    - Routing optimization
    """

    def __init__(self, intelligence_file: str = "./ecosystem/intelligence.json"):
        self.intelligence_file = intelligence_file
        self.patterns: Dict[str, LearnedPattern] = {}
        self.skills: Dict[str, SkillOptimization] = {}
        self._load_intelligence()

    def _load_intelligence(self) -> None:
        """Load existing intelligence from file."""
        try:
            with open(self.intelligence_file, "r") as f:
                data = json.load(f)
                for pattern_data in data.get("patterns", []):
                    pattern = LearnedPattern(**pattern_data)
                    self.patterns[pattern.pattern] = pattern
                for skill_data in data.get("skills", []):
                    skill = SkillOptimization(**skill_data)
                    self.skills[skill.skill_name] = skill
        except FileNotFoundError:
            logger.info("No existing intelligence file found, starting fresh")
        except json.JSONDecodeError:
            logger.warning("Invalid intelligence file, starting fresh")

    def record_interaction(self, agent_id: str, tool_name: str, success: bool, duration: float) -> None:
        """Record an interaction for learning."""
        pattern_key = f"{agent_id}:{tool_name}"
        
        if pattern_key not in self.patterns:
            self.patterns[pattern_key] = LearnedPattern(
                pattern_type="tool_selection",
                pattern=pattern_key,
                frequency=0,
                success_rate=0.0,
                last_used=time.time(),
            )
        
        pattern = self.patterns[pattern_key]
        pattern.frequency += 1
        pattern.last_used = time.time()
        
        # Update success rate with exponential moving average
        alpha = 0.3
        current_success = 1.0 if success else 0.0
        pattern.success_rate = (alpha * current_success) + ((1 - alpha) * pattern.success_rate)
        
        logger.debug(f"Recorded interaction: {pattern_key}, success_rate={pattern.success_rate:.2f}")

    def get_tool_recommendations(self, agent_id: str, task_description: str) -> List[str]:
        """Get tool recommendations based on learned patterns."""
        recommendations = []
        
        for pattern_key, pattern in self.patterns.items():
            if pattern.pattern.startswith(f"{agent_id}:"):
                if pattern.success_rate > 0.7:  # High success rate
                    tool_name = pattern.pattern.split(":")[1]
                    recommendations.append(tool_name)
        
        return recommendations

    def optimize_skill(self, skill_name: str, traces: List[Dict[str, Any]]) -> SkillOptimization:
        """Optimize a skill based on traces."""
        logger.info(f"Optimizing skill: {skill_name}")
        
        # Simple optimization logic
        success_count = sum(1 for t in traces if t.get("success", False))
        total_count = len(traces)
        
        if total_count == 0:
            optimization = SkillOptimization(
                skill_name=skill_name,
                status="no_data",
                trace_count=0,
            )
        else:
            improvement = success_count / total_count
            optimization = SkillOptimization(
                skill_name=skill_name,
                status="optimized",
                trace_count=total_count,
                improvement=improvement,
            )
        
        self.skills[skill_name] = optimization
        return optimization

    def share_knowledge(self, source_agent: str, target_agent: str) -> Dict[str, Any]:
        """Share knowledge between agents."""
        shared_patterns = []
        
        for pattern_key, pattern in self.patterns.items():
            if pattern.pattern.startswith(f"{source_agent}:"):
                # Copy pattern to target agent
                new_key = pattern_key.replace(source_agent, target_agent, 1)
                if new_key not in self.patterns:
                    self.patterns[new_key] = LearnedPattern(
                        pattern_type=pattern.pattern_type,
                        pattern=new_key,
                        frequency=0,
                        success_rate=pattern.success_rate,
                        last_used=time.time(),
                        metadata={"shared_from": source_agent},
                    )
                    shared_patterns.append(new_key)
        
        return {
            "source_agent": source_agent,
            "target_agent": target_agent,
            "shared_patterns": shared_patterns,
            "total_patterns": len(shared_patterns),
        }

    def save_intelligence(self) -> None:
        """Save intelligence to file."""
        data = {
            "patterns": [
                {
                    "pattern_type": p.pattern_type,
                    "pattern": p.pattern,
                    "frequency": p.frequency,
                    "success_rate": p.success_rate,
                    "last_used": p.last_used,
                    "metadata": p.metadata,
                }
                for p in self.patterns.values()
            ],
            "skills": [
                {
                    "skill_name": s.skill_name,
                    "status": s.status,
                    "trace_count": s.trace_count,
                    "improvement": s.improvement,
                }
                for s in self.skills.values()
            ],
        }
        
        with open(self.intelligence_file, "w") as f:
            json.dump(data, f, indent=2)
        
        logger.info(f"Intelligence saved to {self.intelligence_file}")

    def get_learned_patterns(self, pattern_type: Optional[str] = None) -> List[LearnedPattern]:
        """Get learned patterns, optionally filtered by type."""
        patterns = list(self.patterns.values())
        if pattern_type:
            patterns = [p for p in patterns if p.pattern_type == pattern_type]
        return patterns


# ---------------------------------------------------------------------------
# Export
# ---------------------------------------------------------------------------

__all__ = [
    "LearnedPattern",
    "SkillOptimization",
    "EnhancedLearningNetwork",
]