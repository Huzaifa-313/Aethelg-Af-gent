"""
Provider Scout – Extension for GitHub Hunter to discover new LLM providers.
Searches for provider implementations and automatically integrates them.
"""

import os
import json
import shutil
from pathlib import Path
from typing import List, Dict, Optional, Any
from datetime import datetime

from core.hunter.hunter import AgentHunter
from core.safety.scanner import SignatureScanner
from core.providers.registry import ProviderManager

class ProviderScout:
    """Specialized hunter for discovering and integrating new LLM providers."""
    
    def __init__(self, hunter_instance: Optional[AgentHunter] = None):
        self.hunter = hunter_instance or AgentHunter()
        self.provider_dir = Path("core/providers/implementations")
        self.config_path = Path("core/providers/config.yaml")
        self.safety_log = Path("core/system/provider_scout_safety.log")
        
    def search_provider_implementations(self, max_results: int = 20) -> List[Dict]:
        """Search for repositories containing LLM provider implementations."""
        search_queries = [
            "openai-compatible-api-server",
            "provider-for-llm-agents",
            "new-llm-provider-implementation",
            "llm-provider-python",
            "custom-llm-provider"
        ]
        
        all_results = []
        for query in search_queries:
            print(f"Searching for: {query}")
            results = self.hunter.hunt([query], max_results=max_results // len(search_queries))
            all_results.extend(results)
        
        # Deduplicate by repo name
        seen = set()
        unique_results = []
        for result in all_results:
            repo_key = f"{result['owner']}/{result['name']}"
            if repo_key not in seen:
                seen.add(repo_key)
                unique_results.append(result)
        
        return unique_results
    
    def analyze_for_provider_code(self, repo_info: Dict) -> Dict:
        """Analyze a repository for provider implementation code."""
        repo_name = repo_info['name']
        owner = repo_info['owner']
        
        # Stage the repository
        repo_url = repo_info['url']
        if not self.hunter.stage_repository(repo_url, repo_name):
            return {"error": "Failed to stage repository"}
        
        # Analyze staged repo
        analysis = self.hunter.analyze_staged(repo_name)
        
        # Look for provider-specific patterns
        provider_patterns = [
            "provider", "llm", "api", "client", "openai", "anthropic",
            "chat_completion", "list_models", "BaseProvider"
        ]
        
        analysis['provider_score'] = 0
        for pattern in provider_patterns:
            if pattern in analysis.get('code_patterns', []):
                analysis['provider_score'] += 1
        
        return analysis
    
    def extract_provider_code(self, repo_name: str, analysis: Dict) -> Optional[str]:
        """Extract provider implementation code from staged repository."""
        staging_path = self.hunter.staging_dir / repo_name
        if not staging_path.exists():
            return None
        
        # Find Python files that might contain provider code
        provider_files = []
        for py_file in staging_path.rglob("*.py"):
            try:
                with open(py_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if any(keyword in content.lower() for keyword in 
                       ['class', 'provider', 'api', 'chat', 'completion']):
                        provider_files.append(py_file)
            except:
                continue
        
        if not provider_files:
            return None
        
        # Use the first promising file as template
        # In production, this would be more sophisticated
        target_file = provider_files[0]
        provider_name = repo_name.lower().replace('-', '_')
        target_path = self.provider_dir / f"{provider_name}.py"
        
        # Copy and adapt the file
        try:
            shutil.copy(target_file, target_path)
            return provider_name
        except Exception as e:
            print(f"Error extracting provider code: {e}")
            return None
    
    def safety_check_provider(self, provider_name: str) -> bool:
        """Run safety scanner on extracted provider code."""
        provider_path = self.provider_dir / f"{provider_name}.py"
        if not provider_path.exists():
            return False
        
        scanner = SignatureScanner()
        # Simplified safety check - in production would use full scanner
        try:
            with open(provider_path, 'r', encoding='utf-8') as f:
                content = f.read()
                # Check for obvious malicious patterns
                dangerous_patterns = ['os.system', 'subprocess.call', 'eval(', 'exec(']
                for pattern in dangerous_patterns:
                    if pattern in content:
                        self._log_safety(f"Dangerous pattern found in {provider_name}: {pattern}")
                        return False
            return True
        except Exception as e:
            self._log_safety(f"Safety check failed for {provider_name}: {e}")
            return False
    
    def update_config(self, provider_name: str, repo_info: Dict) -> bool:
        """Add new provider to config.yaml."""
        try:
            import yaml
            with open(self.config_path, 'r', encoding='utf-8') as f:
                config = yaml.safe_load(f) or {}
            
            # Add new provider entry
            provider_class = f"core.providers.implementations.{provider_name}.{provider_name.capitalize()}Provider"
            config['providers'][provider_name] = {
                "name": provider_name.capitalize(),
                "class": provider_class,
                "api_key_env": f"{provider_name.upper()}_API_KEY",
                "endpoint": f"https://api.{provider_name}.com/v1",
                "requires_proxy": False,
                "enabled": False  # Disabled by default until tested
            }
            
            with open(self.config_path, 'w', encoding='utf-8') as f:
                yaml.dump(config, f, default_flow_style=False)
            
            self._log_safety(f"Added {provider_name} to config.yaml")
            return True
        except Exception as e:
            print(f"Error updating config: {e}")
            return False
    
    def test_provider(self, provider_name: str) -> Dict:
        """Basic test of newly added provider."""
        try:
            # Reload provider manager to pick up new provider
            manager = ProviderManager()
            provider = manager.get_provider(provider_name)
            
            # Test list_models
            models = provider.list_models()
            
            return {
                "provider": provider_name,
                "status": "success",
                "models_found": len(models),
                "sample_models": models[:3] if models else []
            }
        except Exception as e:
            return {
                "provider": provider_name,
                "status": "failed",
                "error": str(e)
            }
    
    def run_scouting_mission(self) -> Dict:
        """Run a complete scouting mission to find and integrate new providers."""
        print("🎯 Starting provider scouting mission...")
        
        # Search for provider implementations
        candidates = self.search_provider_implementations()
        print(f"Found {len(candidates)} candidate repositories")
        
        integrated = []
        failed = []
        
        for candidate in candidates[:5]:  # Limit to top 5 for safety
            print(f"\n🔍 Analyzing: {candidate['owner']}/{candidate['name']}")
            
            # Analyze for provider code
            analysis = self.analyze_for_provider_code(candidate)
            
            if analysis.get('provider_score', 0) < 2:
                print(f"  ❌ Not a provider implementation (score: {analysis.get('provider_score', 0)})")
                continue
            
            # Extract provider code
            provider_name = self.extract_provider_code(candidate['name'], analysis)
            if not provider_name:
                print(f"  ❌ Could not extract provider code")
                failed.append(candidate['name'])
                continue
            
            # Safety check
            if not self.safety_check_provider(provider_name):
                print(f"  ❌ Safety check failed for {provider_name}")
                # Remove unsafe provider file
                (self.provider_dir / f"{provider_name}.py").unlink(missing_ok=True)
                failed.append(candidate['name'])
                continue
            
            # Update config
            if not self.update_config(provider_name, candidate):
                print(f"  ❌ Failed to update config")
                failed.append(candidate['name'])
                continue
            
            # Test provider
            test_result = self.test_provider(provider_name)
            if test_result['status'] == 'success':
                print(f"  ✅ Successfully integrated {provider_name}")
                integrated.append({
                    "name": provider_name,
                    "repo": f"{candidate['owner']}/{candidate['name']}",
                    "models": test_result.get('sample_models', [])
                })
            else:
                print(f"  ❌ Test failed: {test_result.get('error')}")
                failed.append(candidate['name'])
        
        return {
            "mission_complete": True,
            "candidates_found": len(candidates),
            "successfully_integrated": integrated,
            "failed_integrations": failed,
            "timestamp": datetime.now().isoformat()
        }
    
    def _log_safety(self, message: str):
        """Log safety-related messages."""
        self.safety_log.parent.mkdir(parents=True, exist_ok=True)
        with open(self.safety_log, 'a', encoding='utf-8') as f:
            f.write(f"[{datetime.now().isoformat()}] {message}\n")
