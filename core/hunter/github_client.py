# AETHELGARD MERGED FILE
# Origin Repository: Aethelgard Core
# Original Path: core/hunter/github_client.py
# Merge Date: 2026-05-07T14:20:27Z
# ---

"""
GitHub Client for Agent Hunter
Handles GitHub API interactions and repository discovery.
"""

import requests
import json
from datetime import datetime
from typing import List, Dict, Optional
from pathlib import Path

class GitHubClient:
    """Client for searching and fetching GitHub repositories."""
    
    BASE_URL = "https://api.github.com"
    
    def __init__(self, token: Optional[str] = None):
        self.token = token
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Aethelgard-Agent-Hunter/1.0"
        }
        if token:
            self.headers["Authorization"] = f"token {token}"
    
    def search_repositories(self, query: str, sort: str = "stars", 
                           order: str = "desc", per_page: int = 30) -> List[Dict]:
        """Search GitHub for repositories matching query."""
        url = f"{self.BASE_URL}/search/repositories"
        params = {
            "q": query,
            "sort": sort,
            "order": order,
            "per_page": per_page
        }
        
        try:
            response = requests.get(url, headers=self.headers, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            return data.get("items", [])
        except requests.RequestException as e:
            print(f"GitHub API error: {e}")
            return []
    
    def get_repo_details(self, owner: str, repo: str) -> Optional[Dict]:
        """Get detailed information about a specific repository."""
        url = f"{self.BASE_URL}/repos/{owner}/{repo}"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"GitHub API error: {e}")
            return None
    
    def get_repo_languages(self, owner: str, repo: str) -> Dict[str, int]:
        """Get language statistics for a repository."""
        url = f"{self.BASE_URL}/repos/{owner}/{repo}/languages"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"GitHub API error: {e}")
            return {}
    
    def get_recent_commits(self, owner: str, repo: str, per_page: int = 10) -> List[Dict]:
        """Get recent commits for activity scoring."""
        url = f"{self.BASE_URL}/repos/{owner}/{repo}/commits"
        params = {"per_page": per_page}
        
        try:
            response = requests.get(url, headers=self.headers, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"GitHub API error: {e}")
            return []
    
    def calculate_relevance_score(self, repo_data: Dict, keywords: List[str]) -> int:
        """Calculate relevance score based on multiple factors."""
        score = 0
        
        # Stars (0-40 points)
        stars = repo_data.get("stargazers_count", 0)
        score += min(stars // 100, 40)
        
        # Recent activity (0-30 points)
        updated = repo_data.get("updated_at", "")
        if updated:
            try:
                from datetime import datetime
                last_update = datetime.fromisoformat(updated.replace("Z", "+00:00"))
                days_since = (datetime.now() - last_update).days
                if days_since < 7:
                    score += 30
                elif days_since < 30:
                    score += 20
                elif days_since < 90:
                    score += 10
            except:
                pass
        
        # Keyword matches in description (0-20 points)
        description = repo_data.get("description", "") or ""
        for keyword in keywords:
            if keyword.lower() in description.lower():
                score += 5
        
        # Topics match (0-10 points)
        topics = repo_data.get("topics", [])
        for topic in topics:
            for keyword in keywords:
                if keyword.lower() in topic.lower():
                    score += 2
        
        return min(score, 100)
