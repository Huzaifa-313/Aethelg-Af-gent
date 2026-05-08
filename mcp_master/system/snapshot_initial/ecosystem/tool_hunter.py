#!/usr/bin/env python3
"""
MCP MASTER - AUTONOMOUS TOOL HUNTER
====================================
Searches multiple sources (GitHub, PyPI, NPM, Hugging Face) for
new tools that match detected capability gaps.

Responsibilities:
- Search multiple package repositories for MCP tools
- Filter results by relevance and quality indicators
- Return ranked list of candidate tools for evaluation
- Respect rate limits and avoid API abuse
"""

import json
import re
import time
import sys
import urllib.request
import urllib.parse
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from urllib.error import HTTPError, URLError

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))


@dataclass
class ToolCandidate:
    """Represents a candidate tool found by the hunter."""
    name: str
    source: str  # 'github', 'pypi', 'npm', 'huggingface'
    url: str
    description: str
    stars: int
    language: str
    relevance_score: float
    gap_category: str
    found_at: str
    metadata: Dict[str, Any]


class ToolHunter:
    """
    Autonomous Tool Hunter for the MCP Master ecosystem.
    
    Searches multiple sources for tools that match detected
capability gaps.
    """
    
    def __init__(self, config_path: str = "./ecosystem_config.yaml"):
        """Initialize the Tool Hunter."""
        self.config = self._load_config(config_path)
        self.hunter_config = self.config.get("tool_hunter", {})
        
        # Track requests for rate limiting
        self.request_history: List[datetime] = []
        
        print("[ToolHunter] Initialized")
    
    def _load_config(self, config_path: str) -> Dict:
        """Load configuration from YAML file."""
        import yaml
        try:
            with open(config_path, 'r') as f:
                return yaml.safe_load(f).get("ecosystem", {})
        except Exception as e:
            print(f"[ToolHunter] Warning: Could not load config: {e}")
            return {}
    
    def _respect_rate_limit(self, delay: int = 2):
        """Respect rate limits by adding delays between requests."""
        now = datetime.now()
        self.request_history.append(now)
        
        # Remove requests older than 1 minute
        self.request_history = [r for r in self.request_history 
                               if (now - r).total_seconds() < 60]
        
        # If too many recent requests, wait
        if len(self.request_history) > 10:
            time.sleep(delay)
    
    def search_github(self, query: str, max_results: int = 20) -> List[ToolCandidate]:
        """
        Search GitHub for MCP tools.
        
        Args:
            query: Search query
            max_results: Maximum results to return
            
        Returns:
            List of tool candidates
        """
        print(f"[ToolHunter] Searching GitHub for: {query}")
        candidates = []
        
        try:
            # Use GitHub search API (no auth for public repos, limited rate)
            encoded_query = urllib.parse.quote(f"{query} mcp server")
            url = f"https://api.github.com/search/repositories?q={encoded_query}&sort=stars&order=desc&per_page={max_results}"
            
            self._respect_rate_limit()
            
            req = urllib.request.Request(url)
            req.add_header("Accept", "application/vnd.github.v3+json")
            req.add_header("User-Agent", "MCP-Master-ToolHunter/1.0")
            
            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.loads(response.read().decode())
                
                for item in data.get("items", [])[:max_results]:
                    candidate = ToolCandidate(
                        name=item.get("name", "unknown"),
                        source="github",
                        url=item.get("html_url", ""),
                        description=item.get("description", "") or "No description",
                        stars=item.get("stargazers_count", 0),
                        language=item.get("language", "unknown") or "unknown",
                        relevance_score=0.0,  # Will be calculated
                        gap_category=query,
                        found_at=datetime.now().isoformat(),
                        metadata={
                            "forks": item.get("forks_count", 0),
                            "updated_at": item.get("updated_at", ""),
                            "topics": item.get("topics", []),
                            "license": item.get("license", {}).get("spdx_id", "unknown") if item.get("license") else "unknown"
                        }
                    )
                    candidates.append(candidate)
                    
        except HTTPError as e:
            print(f"[ToolHunter] GitHub API error: {e}")
        except URLError as e:
            print(f"[ToolHunter] GitHub connection error: {e}")
        except Exception as e:
            print(f"[ToolHunter] GitHub search error: {e}")
        
        print(f"[ToolHunter] Found {len(candidates)} candidates on GitHub")
        return candidates
    
    def search_pypi(self, query: str, max_results: int = 15) -> List[ToolCandidate]:
        """
        Search PyPI for MCP tools.
        
        Args:
            query: Search query
            max_results: Maximum results to return
            
        Returns:
            List of tool candidates
        """
        print(f"[ToolHunter] Searching PyPI for: {query}")
        candidates = []
        
        try:
            encoded_query = urllib.parse.quote(query)
            url = f"https://pypi.org/search/?q={encoded_query}"
            
            self._respect_rate_limit()
            
            req = urllib.request.Request(url)
            req.add_header("User-Agent", "MCP-Master-ToolHunter/1.0")
            
            with urllib.request.urlopen(req, timeout=10) as response:
                # PyPI search returns HTML, we'd need to parse it
                # For now, use the JSON API for package info
                pass
            
            # Use PyPI JSON API for specific packages
            search_url = f"https://pypi.org/pypi/{urllib.parse.quote(query)}/json"
            try:
                with urllib.request.urlopen(search_url, timeout=10) as response:
                    data = json.loads(response.read().decode())
                    info = data.get("info", {})
                    
                    candidate = ToolCandidate(
                        name=info.get("name", "unknown"),
                        source="pypi",
                        url=info.get("home_page", info.get("project_url", "")),
                        description=info.get("summary", "No description"),
                        stars=0,  # PyPI doesn't have stars
                        language="python",
                        relevance_score=0.0,
                        gap_category=query,
                        found_at=datetime.now().isoformat(),
                        metadata={
                            "version": info.get("version", "unknown"),
                            "author": info.get("author", "unknown"),
                            "license": info.get("license", "unknown"),
                            "downloads": "unknown"
                        }
                    )
                    candidates.append(candidate)
            except HTTPError:
                pass  # Package not found
                
        except Exception as e:
            print(f"[ToolHunter] PyPI search error: {e}")
        
        print(f"[ToolHunter] Found {len(candidates)} candidates on PyPI")
        return candidates
    
    def search_npm(self, query: str, max_results: int = 15) -> List[ToolCandidate]:
        """
        Search NPM for MCP tools.
        
        Args:
            query: Search query
            max_results: Maximum results to return
            
        Returns:
            List of tool candidates
        """
        print(f"[ToolHunter] Searching NPM for: {query}")
        candidates = []
        
        try:
            encoded_query = urllib.parse.quote(query)
            url = f"https://registry.npmjs.org/-/v1/search?text={encoded_query}&size={max_results}"
            
            self._respect_rate_limit()
            
            req = urllib.request.Request(url)
            req.add_header("User-Agent", "MCP-Master-ToolHunter/1.0")
            
            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.loads(response.read().decode())
                
                for package in data.get("objects", [])[:max_results]:
                    pkg = package.get("package", {})
                    
                    candidate = ToolCandidate(
                        name=pkg.get("name", "unknown"),
                        source="npm",
                        url=pkg.get("links", {}).get("homepage", pkg.get("links", {}).get("npm", "")),
                        description=pkg.get("description", "No description"),
                        stars=0,
                        language="javascript",
                        relevance_score=0.0,
                        gap_category=query,
                        found_at=datetime.now().isoformat(),
                        metadata={
                            "version": pkg.get("version", "unknown"),
                            "publisher": pkg.get("publisher", {}).get("username", "unknown"),
                            "date": pkg.get("date", ""),
                            "keywords": pkg.get("keywords", [])
                        }
                    )
                    candidates.append(candidate)
                    
        except Exception as e:
            print(f"[ToolHunter] NPM search error: {e}")
        
        print(f"[ToolHunter] Found {len(candidates)} candidates on NPM")
        return candidates
    
    def search_huggingface(self, query: str, max_results: int = 10) -> List[ToolCandidate]:
        """
        Search Hugging Face for MCP tools.
        
        Args:
            query: Search query
            max_results: Maximum results to return
            
        Returns:
            List of tool candidates
        """
        print(f"[ToolHunter] Searching Hugging Face for: {query}")
        candidates = []
        
        try:
            encoded_query = urllib.parse.quote(query)
            url = f"https://huggingface.co/api/spaces?search={encoded_query}&limit={max_results}"
            
            self._respect_rate_limit()
            
            req = urllib.request.Request(url)
            req.add_header("User-Agent", "MCP-Master-ToolHunter/1.0")
            
            with urllib.request.urlopen(req, timeout=10) as response:
                spaces = json.loads(response.read().decode())
                
                for space in spaces[:max_results]:
                    candidate = ToolCandidate(
                        name=space.get("id", "unknown"),
                        source="huggingface",
                        url=f"https://huggingface.co/spaces/{space.get('id', '')}",
                        description=space.get("description", "No description"),
                        stars=0,
                        language="python",
                        relevance_score=0.0,
                        gap_category=query,
                        found_at=datetime.now().isoformat(),
                        metadata={
                            "author": space.get("author", "unknown"),
                            "sdk": space.get("sdk", "unknown"),
                            "likes": space.get("likes", 0)
                        }
                    )
                    candidates.append(candidate)
                    
        except Exception as e:
            print(f"[ToolHunter] Hugging Face search error: {e}")
        
        print(f"[ToolHunter] Found {len(candidates)} candidates on Hugging Face")
        return candidates
    
    def calculate_relevance(self, candidate: ToolCandidate, gap_description: str) -> float:
        """
        Calculate relevance score for a candidate tool.
        
        Args:
            candidate: Tool candidate
            gap_description: Description of the capability gap
            
        Returns:
            Relevance score between 0 and 1
        """
        score = 0.0
        
        # Base score from source quality
        source_weights = {
            "github": 0.3,
            "pypi": 0.25,
            "npm": 0.25,
            "huggingface": 0.2
        }
        score += source_weights.get(candidate.source, 0.1)
        
        # Stars/popularity bonus
        if candidate.stars > 100:
            score += 0.2
        elif candidate.stars > 50:
            score += 0.1
        elif candidate.stars > 10:
            score += 0.05
        
        # Language match (simplified - would check against ecosystem preferences)
        if candidate.language in ["python", "javascript", "typescript"]:
            score += 0.1
        
        # Description relevance (simple keyword matching)
        gap_words = set(gap_description.lower().split())
        desc_words = set(candidate.description.lower().split())
        if gap_words & desc_words:
            score += 0.15
        
        # Cap at 1.0
        return min(1.0, score)
    
    def hunt_for_gap(self, gap_category: str, gap_description: str) -> List[ToolCandidate]:
        """
        Hunt for tools matching a specific capability gap.
        
        Args:
            gap_category: Category of the gap
            gap_description: Description of the gap
            
        Returns:
            List of ranked tool candidates
        """
        print(f"[ToolHunter] Hunting for tools matching: {gap_category}")
        
        all_candidates = []
        sources = self.hunter_config.get("sources", {})
        
        # Search GitHub
        if sources.get("github", {}).get("enabled", True):
            github_results = self.search_github(gap_category)
            all_candidates.extend(github_results)
        
        # Search PyPI
        if sources.get("pypi", {}).get("enabled", True):
            pypi_results = self.search_pypi(gap_category)
            all_candidates.extend(pypi_results)
        
        # Search NPM
        if sources.get("npm", {}).get("enabled", True):
            npm_results = self.search_npm(gap_category)
            all_candidates.extend(npm_results)
        
        # Search Hugging Face
        if sources.get("huggingface", {}).get("enabled", True):
            hf_results = self.search_huggingface(gap_category)
            all_candidates.extend(hf_results)
        
        # Calculate relevance scores
        for candidate in all_candidates:
            candidate.relevance_score = self.calculate_relevance(candidate, gap_description)
        
        # Sort by relevance score
        all_candidates.sort(key=lambda c: c.relevance_score, reverse=True)
        
        print(f"[ToolHunter] Found {len(all_candidates)} total candidates for {gap_category}")
        return all_candidates
    
    def get_hunt_summary(self) -> Dict:
        """Get summary of hunting activity."""
        return {
            "total_searches": len(self.request_history),
            "sources_searched": ["github", "pypi", "npm", "huggingface"],
            "last_search": self.request_history[-1].isoformat() if self.request_history else None
        }


def main():
    """CLI entry point for the Tool Hunter."""
    hunter = ToolHunter()
    
    import argparse
    parser = argparse.ArgumentParser(description="MCP Master Tool Hunter")
    parser.add_argument("command", choices=["hunt", "summary"])
    parser.add_argument("--category", help="Gap category to search for")
    parser.add_argument("--description", help="Gap description")
    
    args = parser.parse_args()
    
    if args.command == "hunt":
        if not args.category:
            print("Error: --category required for hunt")
            return
        
        candidates = hunter.hunt_for_gap(
            args.category,
            args.description or args.category
        )
        
        print(f"\nFound {len(candidates)} candidates:")
        for i, candidate in enumerate(candidates[:10], 1):
            print(f"{i}. [{candidate.source}] {candidate.name} (score: {candidate.relevance_score:.2f})")
            print(f"   {candidate.description[:100]}...")
            print(f"   URL: {candidate.url}")
            print()
    
    elif args.command == "summary":
        print(json.dumps(hunter.get_hunt_summary(), indent=2))


if __name__ == "__main__":
    main()
