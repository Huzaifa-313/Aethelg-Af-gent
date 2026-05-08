# AETHELGARD MERGED FILE
# Origin Repository: Aethelgard Core
# Original Path: core/hunter/hunter.py
# Merge Date: 2026-05-07T14:22:16Z
# ---

"""
Agent Hunter - Main orchestrator for discovering and integrating external agents.
"""

import os
import shutil
import json
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional
from .github_client import GitHubClient
from .analyzer import RepoAnalyzer

class AgentHunter:
    """Main hunter class that coordinates discovery, analysis, and integration."""
    
    def __init__(self, 
                 github_token: Optional[str] = None,
                 staging_dir: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\_aethelgard_safety\\hunter_staging",
                 ingested_dir: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\core\\hunter_ingested"):
        self.github = GitHubClient(github_token)
        self.staging_dir = Path(staging_dir)
        self.ingested_dir = Path(ingested_dir)
        self.staging_dir.mkdir(parents=True, exist_ok=True)
        self.ingested_dir.mkdir(parents=True, exist_ok=True)
        self.activity_log = "c:\\Users\\Hashmi\\Desktop\\mycoder\\_aethelgard_safety\\hunter_activity.log"
    
    def hunt(self, keywords: List[str], max_results: int = 10) -> List[Dict]:
        """Search for and analyze repositories matching keywords."""
        print(f"Hunting for repositories matching: {', '.join(keywords)}")
        
        # Search GitHub
        query = " ".join(keywords)
        repos = self.github.search_repositories(query, per_page=max_results)
        
        results = []
        for repo in repos:
            owner = repo["owner"]["login"]
            name = repo["name"]
            
            print(f"  Analyzing: {owner}/{name}")
            
            # Calculate relevance score
            score = self.github.calculate_relevance_score(repo, keywords)
            
            # Get language stats
            languages = self.github.get_repo_languages(owner, name)
            
            result = {
                "name": name,
                "owner": owner,
                "url": repo["html_url"],
                "stars": repo["stargazers_count"],
                "description": repo.get("description", ""),
                "relevance_score": score,
                "languages": languages,
                "last_updated": repo.get("updated_at", ""),
                "analyzed_at": datetime.now().isoformat()
            }
            results.append(result)
            
            # Log activity
            self._log_activity(f"Analyzed {owner}/{name} - Score: {score}/100")
        
        # Sort by relevance score
        results.sort(key=lambda x: x["relevance_score"], reverse=True)
        return results
    
    def stage_repository(self, repo_url: str, repo_name: str) -> bool:
        """Clone a repository into the staging area."""
        staging_path = self.staging_dir / repo_name
        
        # Remove existing staging
        if staging_path.exists():
            shutil.rmtree(staging_path)
        
        try:
            # Clone repository
            import subprocess
            result = subprocess.run(
                ["git", "clone", "--depth", "1", repo_url, str(staging_path)],
                capture_output=True, text=True, timeout=120
            )
            
            if result.returncode == 0:
                self._log_activity(f"Staged {repo_name} successfully")
                return True
            else:
                self._log_activity(f"Failed to stage {repo_name}: {result.stderr}")
                return False
                
        except Exception as e:
            self._log_activity(f"Error staging {repo_name}: {e}")
            return False
    
    def analyze_staged(self, repo_name: str) -> Dict:
        """Analyze a staged repository for capabilities."""
        staging_path = self.staging_dir / repo_name
        
        if not staging_path.exists():
            return {"error": "Repository not staged"}
        
        analyzer = RepoAnalyzer(str(staging_path))
        analysis = analyzer.analyze()
        
        self._log_activity(f"Analyzed {repo_name}: {analysis['total_files']} files, "
                          f"Agent code: {analysis['has_agent_code']}, "
                          f"Tools: {analysis['has_tools']}")
        
        return analysis
    
    def approve_for_integration(self, repo_name: str, analysis: Dict) -> bool:
        """Decide if a repository should be integrated."""
        # Criteria for integration
        if analysis.get("has_agent_code") or analysis.get("has_tools"):
            return True
        if analysis.get("total_files", 0) > 50:
            return True
        
        return False
    
    def move_to_ingested(self, repo_name: str) -> bool:
        """Move staged repository to ingested area for manual review."""
        staging_path = self.staging_dir / repo_name
        ingested_path = self.ingested_dir / repo_name
        
        if not staging_path.exists():
            return False
        
        try:
            if ingested_path.exists():
                shutil.rmtree(ingested_path)
            
            shutil.move(str(staging_path), str(ingested_path))
            self._log_activity(f"Moved {repo_name} to ingested area")
            return True
            
        except Exception as e:
            self._log_activity(f"Error moving {repo_name}: {e}")
            return False
    
    def _log_activity(self, message: str):
        """Log hunter activity."""
        timestamp = datetime.now().isoformat()
        with open(self.activity_log, 'a', encoding='utf-8') as f:
            f.write(f"[{timestamp}] {message}\n")
