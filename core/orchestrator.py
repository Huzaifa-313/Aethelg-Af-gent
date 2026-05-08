# AETHELGARD MERGED FILE
# Origin Repository: Aethelgard Core
# Original Path: core/orchestrator.py
# Merge Date: 2026-05-07T14:28:14Z
# ---

"""
Aethelgard Unified Agent Orchestrator
Central brain that manages memory, goals, task queue, and tool selection.
Integrates with provider registry for LLM routing.
"""

import os
import sys
import json
import hashlib
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional, Any
from dataclasses import dataclass, field
from enum import Enum

# Import provider registry for LLM routing
try:
    from core.providers.registry import ProviderManager
    from core.providers.base import BaseProvider, ProviderError
    _HAVE_PROVIDERS = True
except ImportError:
    _HAVE_PROVIDERS = False
    ProviderManager = None
    BaseProvider = None
    ProviderError = Exception

class TaskStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    QUARANTINED = "quarantined"

@dataclass
class Task:
    id: str
    description: str
    capability: str
    status: TaskStatus = TaskStatus.PENDING
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())
    completed_at: Optional[str] = None
    result: Optional[Any] = None
    error: Optional[str] = None
    # Provider routing info
    provider: Optional[str] = None
    model: Optional[str] = None

class AgentOrchestrator:
    """Central orchestrator for the Aethelgard agent platform."""
    
    def __init__(self, 
                 core_dir: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\core",
                 safety_dir: str = "c:\\Users\\Hashmi\\Desktop\\mycoder\\_aethelgard_safety"):
        self.core_dir = Path(core_dir)
        self.safety_dir = Path(safety_dir)
        self.memory = {}
        self.goals = []
        self.task_queue = []
        self.completed_tasks = []
        self.critical_files = {}
        
        # Provider registry integration
        self.provider_manager = None
        if _HAVE_PROVIDERS:
            try:
                self.provider_manager = ProviderManager()
            except Exception as e:
                print(f"Warning: Could not initialize provider manager: {e}")
        
        # Load or initialize state
        self._load_state()
    
    def _load_state(self):
        """Load orchestrator state from disk."""
        state_file = self.safety_dir / "orchestrator_state.json"
        if state_file.exists():
            try:
                with open(state_file, 'r', encoding='utf-8') as f:
                    state = json.load(f)
                    self.memory = state.get('memory', {})
                    self.goals = state.get('goals', [])
                    self.completed_tasks = state.get('completed_tasks', [])
            except:
                pass
    
    def _save_state(self):
        """Save orchestrator state to disk."""
        state = {
            'memory': self.memory,
            'goals': self.goals,
            'last_updated': datetime.now().isoformat()
        }
        state_file = self.safety_dir / "orchestrator_state.json"
        with open(state_file, 'w', encoding='utf-8') as f:
            json.dump(state, f, indent=2)
    
    def add_goal(self, goal: str):
        """Add a new goal to the system."""
        self.goals.append({
            'description': goal,
            'created_at': datetime.now().isoformat(),
            'status': 'active'
        })
        self._save_state()
    
    def create_task(self, description: str, capability: str) -> Task:
        """Create a new task."""
        import uuid
        task = Task(
            id=str(uuid.uuid4()),
            description=description,
            capability=capability
        )
        self.task_queue.append(task)
        return task
    
    def execute_task(self, task: Task) -> Any:
        """Execute a task using the appropriate tool."""
        task.status = TaskStatus.IN_PROGRESS
        
        try:
            # Route to appropriate handler based on capability
            if task.capability == "search":
                result = self._handle_search(task)
            elif task.capability == "browse":
                result = self._handle_browse(task)
            elif task.capability == "automate":
                result = self._handle_automate(task)
            elif task.capability == "analyze":
                result = self._handle_analyze(task)
            elif task.capability == "security":
                result = self._handle_security(task)
            elif task.capability == "hunt":
                result = self._handle_hunt(task)
            elif task.capability == "crewai":
                result = self._handle_crewai(task)
            elif task.capability == "autogen":
                result = self._handle_autogen(task)
            elif task.capability == "langgraph":
                result = self._handle_langgraph(task)
            elif task.capability == "llm":
                result = self._handle_llm(task)
            else:
                result = f"Unknown capability: {task.capability}"
            
            task.status = TaskStatus.COMPLETED
            task.completed_at = datetime.now().isoformat()
            task.result = result
            
        except Exception as e:
            task.status = TaskStatus.FAILED
            task.error = str(e)
        
        self.completed_tasks.append(task)
        self._save_state()
        return task.result
    
    def _handle_search(self, task: Task) -> str:
        """Handle search capability."""
        return f"Search executed: {task.description}"
    
    def _handle_browse(self, task: Task) -> str:
        """Handle browse capability."""
        return f"Browse executed: {task.description}"
    
    def _handle_automate(self, task: Task) -> str:
        """Handle automation capability."""
        return f"Automation executed: {task.description}"
    
    def _handle_analyze(self, task: Task) -> str:
        """Handle analysis capability."""
        return f"Analysis executed: {task.description}"
    
    def _handle_security(self, task: Task) -> str:
        """Handle security scanning capability."""
        return f"Security scan executed: {task.description}"
    
    def _handle_hunt(self, task: Task) -> str:
        """Handle hunter agent capability."""
        return f"Hunter executed: {task.description}"
 
    def _handle_crewai(self, task: Task) -> str:
        """Handle CrewAI agent capability.
        Delegates to crewAI core modules if needed.
        """
        return f"CrewAI executed: {task.description}"
 
    def _handle_autogen(self, task: Task) -> str:
        """Handle AutoGen agent capability.
        Delegates to autogen core modules.
        """
        return f"AutoGen executed: {task.description}"
 
    def _handle_langgraph(self, task: Task) -> str:
        """Handle LangGraph agent capability.
        Delegates to LangGraph workflow execution.
        """
        return f"LangGraph executed: {task.description}"
    
    def _handle_llm(self, task: Task) -> str:
        """Handle LLM chat completion via provider registry."""
        if not self.provider_manager:
            return "Provider registry not available"
        
        try:
            # Use task's provider/model or default
            model_ref = task.model
            if not model_ref and task.provider:
                # Get first model from provider
                models = self.provider_manager.get_provider(task.provider).list_models()
                if models:
                    model_ref = f"{task.provider}/{models[0]}"
            
            if not model_ref:
                # Use default provider
                model_ref = "openai/gpt-3.5-turbo"
            
            messages = [{"role": "user", "content": task.description}]
            response = self.provider_manager.chat(model_ref, messages)
            return response
        except Exception as e:
            return f"LLM execution failed: {str(e)}"
    
    # Provider management methods
    def list_providers(self) -> List[str]:
        """List all registered providers."""
        if not self.provider_manager:
            return []
        return self.provider_manager.list_providers()
    
    def list_models(self, provider_name: Optional[str] = None) -> List[str]:
        """List all models or models for a specific provider."""
        if not self.provider_manager:
            return []
        
        if provider_name:
            provider = self.provider_manager.get_provider(provider_name)
            return provider.list_models()
        else:
            return self.provider_manager.get_all_models()
    
    def switch_provider(self, task: Task, provider_name: str):
        """Switch the provider for a task."""
        task.provider = provider_name
    
    def set_default_provider(self, provider_name: str):
        """Set the default provider in config."""
        if self.provider_manager:
            self.provider_manager._default_provider = provider_name
    
    def get_provider_health(self) -> Dict[str, bool]:
        """Check health of all providers."""
        if not self.provider_manager:
            return {}
        return self.provider_manager.health_check()
    
    def self_check(self) -> Dict:
        """Verify integrity of critical core files."""
        results = {
            'timestamp': datetime.now().isoformat(),
            'files_checked': 0,
            'files_modified': [],
            'files_missing': [],
            'status': 'healthy'
        }
        
        # Check critical files
        critical_files = [
            'orchestrator.py',
            'hunter/hunter.py',
            'safety/scanner.py',
            'safety/quarantine.py',
            'providers/registry.py',
            'providers/base.py'
        ]
        
        for file_path in critical_files:
            full_path = self.core_dir / file_path
            if not full_path.exists():
                results['files_missing'].append(file_path)
                results['status'] = 'critical'
                continue
            
            # Check if file hash matches stored hash
            current_hash = self._compute_hash(full_path)
            stored_hash = self.critical_files.get(file_path)
            
            if stored_hash and current_hash != stored_hash:
                results['files_modified'].append(file_path)
                results['status'] = 'warning'
            
            results['files_checked'] += 1
        
        return results
    
    def _compute_hash(self, filepath: Path) -> str:
        """Compute SHA-256 hash of a file."""
        h = hashlib.sha256()
        with open(filepath, 'rb') as f:
            for chunk in iter(lambda: f.read(8192), b''):
                h.update(chunk)
        return h.hexdigest()
    
    def spawn_sub_agent(self, agent_type: str, task: Task) -> Task:
        """Spawn a sub-agent for specialized tasks."""
        if agent_type == "hunter":
            from core.hunter.hunter import AgentHunter
            hunter = AgentHunter()
            # Hunter operations would go here
            task.status = TaskStatus.COMPLETED
            task.result = "Hunter agent spawned"
        elif agent_type == "safety":
            from core.safety.scanner import SignatureScanner
            scanner = SignatureScanner()
            # Safety operations would go here
            task.status = TaskStatus.COMPLETED
            task.result = "Safety scanner spawned"
        
        return task
    
    def get_status(self) -> Dict:
        """Get current orchestrator status."""
        status = {
            'memory_keys': list(self.memory.keys()),
            'active_goals': len(self.goals),
            'pending_tasks': len([t for t in self.task_queue if t.status == TaskStatus.PENDING]),
            'completed_tasks': len(self.completed_tasks),
            'timestamp': datetime.now().isoformat()
        }
        
        # Add provider info if available
        if self.provider_manager:
            status['providers'] = self.list_providers()
            status['default_provider'] = self.provider_manager._default_provider
        
        return status
