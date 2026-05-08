# Mahoraga MCP Server - GitHub Client
# Hunts for new MCP tools on GitHub

import requests
import json
from datetime import datetime
from typing import List, Dict, Optional

class GitHubClient:
    """Client for searching GitHub repositories for MCP tools."""
    
    BASE_URL = "https://api.github.com"
    
    def __init__(self, token: Optional[str] = None):
        self.token = token
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Mahoraga-MCP-Server/1.0"
        }
        if token:
            self.headers["Authorization"] = f"token {token}"
    
    def search_mcp_tools(self, keywords: List[str] = None, per_page: int = 30) -> List[Dict]:
        """Search for MCP-compatible tools on GitHub."""
        if keywords is None:
            keywords = ["mcp", "model-context-protocol", "mcp-server", "mcp-tool"]
        
        query = " ".join(keywords) + " language:python OR language:javascript OR language:typescript"
        url = f"{self.BASE_URL}/search/repositories"
        params = {
            "q": query,
            "sort": "stars",
            "order": "desc",
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
        """Get detailed repository information."""
        url = f"{self.BASE_URL}/repos/{owner}/{repo}"
        try:
            response = requests.get(url, headers=self.headers, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"GitHub API error: {e}")
            return None
    
    def calculate_tool_score(self, repo_data: Dict, keywords: List[str]) -> int:
        """Calculate relevance score for tool integration."""
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
        
        # Check for MCP-related files
        name = repo_data.get("name", "").lower()
        description = repo_data.get("description", "") or ""
        
        mcp_indicators = ["mcp", "model-context-protocol", "server", "tool"]
        for indicator in mcp_indicators:
            if indicator in name or indicator in description.lower():
                score += 5
        
        return min(score, 100)
