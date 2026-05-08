"""
Unified Agent Orchestration Interface — integrates all extracted capabilities.

This module provides a single entry point that ties together:
  - core/claude_patterns/coordinator.py: Agent coordination
  - mcp_master/workflows/workflow_orchestration_engine.py: Workflow DAGs
  - mcp_master/security_tools/guardrails_engine.py: Security scanning
  - mcp_master/search/unified_search_engine.py: Meta-search
  - mcp_master/web/unified_browser_engine.py: Browser automation
  - mcp_master/automation/pc_pilot_engine.py: PC automation
  - mcp_master/integrations/channel_bridge.py: Channel routing
  - mcp_master/system/llm_cache_engine.py: Response caching
  - mcp_master/analysis/model_analysis_engine.py: Model analysis

Gold-safe: This file is ADDITIVE only — it does not modify any existing gold data.
"""

from __future__ import annotations

import json
import logging
import time
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable, Dict, List, Optional, Sequence

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Core types
# ---------------------------------------------------------------------------

class AgentCapability(str, Enum):
    SEARCH = "search"
    BROWSE = "browse"
    CODE = "code"
    AUTOMATE = "automate"
    ANALYZE = "analyze"
    COMMUNICATE = "communicate"
    WORKFLOW = "workflow"
    CACHE = "cache"
    SECURITY = "security"


class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass
class AgentTask:
    """A task to be executed by the agent system."""
    task_id: str = ""
    description: str = ""
    capability: AgentCapability = AgentCapability.SEARCH
    priority: TaskPriority = TaskPriority.MEDIUM
    parameters: Dict[str, Any] = field(default_factory=dict)
    context: Dict[str, Any] = field(default_factory=dict)
    parent_task_id: Optional[str] = None
    created_at: float = 0.0

    def __post_init__(self):
        if not self.task_id:
            import uuid
            self.task_id = str(uuid.uuid4())[:8]
        if not self.created_at:
            self.created_at = time.time()


@dataclass
class AgentResult:
    """Result from an agent task execution."""
    task_id: str
    success: bool
    output: Any = None
    error: Optional[str] = None
    duration_seconds: float = 0.0
    metadata: Dict[str, Any] = field(default_factory=dict)
    source: str = ""


# ---------------------------------------------------------------------------
# Capability handlers (lazy-loaded interfaces to extracted modules)
# ---------------------------------------------------------------------------

class CapabilityHandler:
    """Base class for capability handlers."""

    def __init__(self, capability: AgentCapability):
        self.capability = capability
        self._initialized = False

    def initialize(self) -> bool:
        """Initialize the handler (lazy load dependencies)."""
        self._initialized = True
        return True

    @property
    def is_initialized(self) -> bool:
        return self._initialized


class SearchHandler(CapabilityHandler):
    """Handles search tasks using unified_search_engine."""

    def __init__(self):
        super().__init__(AgentCapability.SEARCH)
        self._engine = None

    def initialize(self) -> bool:
        try:
            from mcp_master.search.unified_search_engine import UnifiedSearchEngine
            self._engine = UnifiedSearchEngine()
            self._initialized = True
            return True
        except ImportError:
            logger.warning("unified_search_engine not available, using stub")
            self._initialized = True
            return True

    def execute(self, task: AgentTask) -> AgentResult:
        if not self._initialized:
            self.initialize()
        t0 = time.time()
        try:
            query = task.parameters.get("query", task.description)
            if self._engine:
                results = self._engine.search(query)
                return AgentResult(
                    task_id=task.task_id,
                    success=True,
                    output=[{"title": r.title, "url": r.url, "snippet": r.snippet} for r in results],
                    duration_seconds=time.time() - t0,
                    source="unified_search_engine",
                )
            return AgentResult(
                task_id=task.task_id,
                success=True,
                output=f"Search stub for: {query}",
                duration_seconds=time.time() - t0,
                source="search_stub",
            )
        except Exception as e:
            return AgentResult(
                task_id=task.task_id,
                success=False,
                error=str(e),
                duration_seconds=time.time() - t0,
                source="search_handler",
            )


class BrowseHandler(CapabilityHandler):
    """Handles browser automation tasks using unified_browser_engine."""

    def __init__(self):
        super().__init__(AgentCapability.BROWSE)
        self._engine = None

    def initialize(self) -> bool:
        try:
            from mcp_master.web.unified_browser_engine import UnifiedBrowserEngine
            self._engine = UnifiedBrowserEngine()
            self._initialized = True
            return True
        except ImportError:
            logger.warning("unified_browser_engine not available, using stub")
            self._initialized = True
            return True

    def execute(self, task: AgentTask) -> AgentResult:
        if not self._initialized:
            self.initialize()
        t0 = time.time()
        try:
            url = task.parameters.get("url", "")
            action = task.parameters.get("action", "navigate")
            if self._engine:
                if action == "navigate":
                    result = self._engine.navigate(url)
                elif action == "screenshot":
                    result = self._engine.screenshot()
                else:
                    result = self._engine.navigate(url)
                return AgentResult(
                    task_id=task.task_id,
                    success=True,
                    output=result,
                    duration_seconds=time.time() - t0,
                    source="unified_browser_engine",
                )
            return AgentResult(
                task_id=task.task_id,
                success=True,
                output=f"Browse stub: {action} {url}",
                duration_seconds=time.time() - t0,
                source="browse_stub",
            )
        except Exception as e:
            return AgentResult(
                task_id=task.task_id,
                success=False,
                error=str(e),
                duration_seconds=time.time() - t0,
                source="browse_handler",
            )


class AutomateHandler(CapabilityHandler):
    """Handles PC automation tasks using pc_pilot_engine."""

    def __init__(self):
        super().__init__(AgentCapability.AUTOMATE)
        self._engine = None

    def initialize(self) -> bool:
        try:
            from mcp_master.automation.pc_pilot_engine import UnifiedPCAutomation
            self._engine = UnifiedPCAutomation()
            self._initialized = True
            return True
        except ImportError:
            logger.warning("pc_pilot_engine not available, using stub")
            self._initialized = True
            return True

    def execute(self, task: AgentTask) -> AgentResult:
        if not self._initialized:
            self.initialize()
        t0 = time.time()
        try:
            action = task.parameters.get("action", "screenshot")
            if self._engine:
                if action == "click":
                    result = self._engine.click(task.parameters["x"], task.parameters["y"])
                elif action == "type_text":
                    result = self._engine.type_text(task.parameters["text"])
                elif action == "screenshot":
                    result = self._engine.screenshot()
                else:
                    result = self._engine.screenshot()
                return AgentResult(
                    task_id=task.task_id,
                    success=True,
                    output=result,
                    duration_seconds=time.time() - t0,
                    source="pc_pilot_engine",
                )
            return AgentResult(
                task_id=task.task_id,
                success=True,
                output=f"Automate stub: {action}",
                duration_seconds=time.time() - t0,
                source="automate_stub",
            )
        except Exception as e:
            return AgentResult(
                task_id=task.task_id,
                success=False,
                error=str(e),
                duration_seconds=time.time() - t0,
                source="automate_handler",
            )


class AnalyzeHandler(CapabilityHandler):
    """Handles model analysis tasks using model_analysis_engine."""

    def __init__(self):
        super().__init__(AgentCapability.ANALYZE)
        self._engine = None

    def initialize(self) -> bool:
        try:
            from mcp_master.analysis.model_analysis_engine import ModelAnalysisEngine
            self._engine = ModelAnalysisEngine()
            self._initialized = True
            return True
        except ImportError:
            logger.warning("model_analysis_engine not available, using stub")
            self._initialized = True
            return True

    def execute(self, task: AgentTask) -> AgentResult:
        if not self._initialized:
            self.initialize()
        t0 = time.time()
        try:
            action = task.parameters.get("action", "analyze")
            if self._engine:
                from mcp_master.analysis.model_analysis_engine import ModelResponse
                response = ModelResponse(
                    content=task.parameters.get("content", ""),
                    model=task.parameters.get("model", ""),
                )
                analyzed = self._engine.analyze_response(response)
                return AgentResult(
                    task_id=task.task_id,
                    success=True,
                    output={
                        "category": analyzed.category.value,
                        "safety_level": analyzed.safety_level.value,
                        "metadata": analyzed.metadata,
                    },
                    duration_seconds=time.time() - t0,
                    source="model_analysis_engine",
                )
            return AgentResult(
                task_id=task.task_id,
                success=True,
                output=f"Analyze stub: {action}",
                duration_seconds=time.time() - t0,
                source="analyze_stub",
            )
        except Exception as e:
            return AgentResult(
                task_id=task.task_id,
                success=False,
                error=str(e),
                duration_seconds=time.time() - t0,
                source="analyze_handler",
            )


class SecurityHandler(CapabilityHandler):
    """Handles security scanning tasks using guardrails_engine."""

    def __init__(self):
        super().__init__(AgentCapability.SECURITY)
        self._engine = None

    def initialize(self) -> bool:
        try:
            from mcp_master.security_tools.guardrails_engine import create_guardrails_engine
            self._engine = create_guardrails_engine(mode="warn")
            self._initialized = True
            return True
        except ImportError:
            logger.warning("guardrails_engine not available, using stub")
            self._initialized = True
            return True

    def execute(self, task: AgentTask) -> AgentResult:
        if not self._initialized:
            self.initialize()
        t0 = time.time()
        try:
            action = task.parameters.get("action", "scan")
            text = task.parameters.get("text", task.description)
            if self._engine:
                if action == "scan_input":
                    result = self._engine.scan_input(text)
                elif action == "scan_output":
                    result = self._engine.scan_output(text)
                else:
                    result = self._engine.scan_input(text)
                return AgentResult(
                    task_id=task.task_id,
                    success=True,
                    output={"scanned_text": result[:200], "findings": self._engine.scan_log[-1] if self._engine.scan_log else {}},
                    duration_seconds=time.time() - t0,
                    source="guardrails_engine",
                )
            return AgentResult(
                task_id=task.task_id,
                success=True,
                output=f"Security stub: {action}",
                duration_seconds=time.time() - t0,
                source="security_stub",
            )
        except Exception as e:
            return AgentResult(
                task_id=task.task_id,
                success=False,
                error=str(e),
                duration_seconds=time.time() - t0,
                source="security_handler",
            )


class WorkflowHandler(CapabilityHandler):
    """Handles workflow orchestration tasks using workflow_orchestration_engine."""

    def __init__(self):
        super().__init__(AgentCapability.WORKFLOW)
        self._engine = None

    def initialize(self) -> bool:
        try:
            from mcp_master.workflows.workflow_orchestration_engine import WorkflowOrchestrationEngine
            self._engine = WorkflowOrchestrationEngine()
            self._initialized = True
            return True
        except ImportError:
            logger.warning("workflow_orchestration_engine not available, using stub")
            self._initialized = True
            return True

    def execute(self, task: AgentTask) -> AgentResult:
        if not self._initialized:
            self.initialize()
        t0 = time.time()
        try:
            if self._engine:
                from mcp_master.workflows.workflow_orchestration_engine import build_manus_style_workflow
                graph = build_manus_style_workflow(
                    researcher_fn=lambda s: f"Researched: {s.messages[-1] if s.messages else ''}",
                    coder_fn=lambda s: f"Coded: {s.messages[-1] if s.messages else ''}",
                )
                result = self._engine.run(graph, initial_input=task.description)
                return AgentResult(
                    task_id=task.task_id,
                    success=result.success,
                    output=result.final_output,
                    duration_seconds=time.time() - t0,
                    metadata={"steps": len(result.steps)},
                    source="workflow_orchestration_engine",
                )
            return AgentResult(
                task_id=task.task_id,
                success=True,
                output=f"Workflow stub for: {task.description}",
                duration_seconds=time.time() - t0,
                source="workflow_stub",
            )
        except Exception as e:
            return AgentResult(
                task_id=task.task_id,
                success=False,
                error=str(e),
                duration_seconds=time.time() - t0,
                source="workflow_handler",
            )


class CommunicateHandler(CapabilityHandler):
    """Handles channel communication tasks using channel_bridge."""

    def __init__(self):
        super().__init__(AgentCapability.COMMUNICATE)
        self._bridge = None

    def initialize(self) -> bool:
        try:
            from mcp_master.integrations.channel_bridge import ChannelBridge
            self._bridge = ChannelBridge()
            self._initialized = True
            return True
        except ImportError:
            logger.warning("channel_bridge not available, using stub")
            self._initialized = True
            return True

    def execute(self, task: AgentTask) -> AgentResult:
        if not self._initialized:
            self.initialize()
        t0 = time.time()
        try:
            action = task.parameters.get("action", "send")
            if self._bridge:
                from mcp_master.integrations.channel_bridge import ChannelMessage
                message = ChannelMessage(
                    content=task.parameters.get("message", task.description),
                    channel_id=task.parameters.get("channel", ""),
                )
                if action == "broadcast":
                    results = self._bridge.broadcast(message)
                    return AgentResult(
                        task_id=task.task_id,
                        success=True,
                        output=results,
                        duration_seconds=time.time() - t0,
                        source="channel_bridge",
                    )
                elif action == "send":
                    channel_id = task.parameters.get("channel_id", "default")
                    success = self._bridge.send(channel_id, message)
                    return AgentResult(
                        task_id=task.task_id,
                        success=success,
                        output=f"Sent to {channel_id}",
                        duration_seconds=time.time() - t0,
                        source="channel_bridge",
                    )
            return AgentResult(
                task_id=task.task_id,
                success=True,
                output=f"Communicate stub: {action}",
                duration_seconds=time.time() - t0,
                source="communicate_stub",
            )
        except Exception as e:
            return AgentResult(
                task_id=task.task_id,
                success=False,
                error=str(e),
                duration_seconds=time.time() - t0,
                source="communicate_handler",
            )


class CacheHandler(CapabilityHandler):
    """Handles caching tasks using llm_cache_engine."""

    def __init__(self):
        super().__init__(AgentCapability.CACHE)
        self._engine = None

    def initialize(self) -> bool:
        try:
            from mcp_master.system.llm_cache_engine import create_cache_engine
            self._engine = create_cache_engine(backend="memory")
            self._initialized = True
            return True
        except ImportError:
            logger.warning("llm_cache_engine not available, using stub")
            self._initialized = True
            return True

    def execute(self, task: AgentTask) -> AgentResult:
        if not self._initialized:
            self.initialize()
        t0 = time.time()
        try:
            action = task.parameters.get("action", "lookup")
            if self._engine:
                if action == "lookup":
                    result = self._engine.lookup(
                        task.parameters.get("prompt", ""),
                        model=task.parameters.get("model", ""),
                    )
                    return AgentResult(
                        task_id=task.task_id,
                        success=True,
                        output=result,
                        duration_seconds=time.time() - t0,
                        metadata={"cache_hit": result is not None},
                        source="llm_cache_engine",
                    )
                elif action == "store":
                    self._engine.store(
                        task.parameters.get("prompt", ""),
                        task.parameters.get("response", ""),
                        model=task.parameters.get("model", ""),
                    )
                    return AgentResult(
                        task_id=task.task_id,
                        success=True,
                        output="Cached",
                        duration_seconds=time.time() - t0,
                        source="llm_cache_engine",
                    )
                elif action == "stats":
                    return AgentResult(
                        task_id=task.task_id,
                        success=True,
                        output=self._engine.stats.__dict__,
                        duration_seconds=time.time() - t0,
                        source="llm_cache_engine",
                    )
            return AgentResult(
                task_id=task.task_id,
                success=True,
                output=f"Cache stub: {action}",
                duration_seconds=time.time() - t0,
                source="cache_stub",
            )
        except Exception as e:
            return AgentResult(
                task_id=task.task_id,
                success=False,
                error=str(e),
                duration_seconds=time.time() - t0,
                source="cache_handler",
            )


# ---------------------------------------------------------------------------
# Unified Agent Orchestrator
# ---------------------------------------------------------------------------

class UnifiedAgentOrchestrator:
    """Single entry point for all agent capabilities.

    Routes tasks to the appropriate capability handler, manages
    initialization, and provides a unified interface.

    Usage:
        orchestrator = UnifiedAgentOrchestrator()
        result = orchestrator.execute(AgentTask(
            description="Search for Python tutorials",
            capability=AgentCapability.SEARCH,
            parameters={"query": "Python tutorials"},
        ))
    """

    def __init__(self, auto_initialize: bool = True):
        self._handlers: Dict[AgentCapability, CapabilityHandler] = {
            AgentCapability.SEARCH: SearchHandler(),
            AgentCapability.BROWSE: BrowseHandler(),
            AgentCapability.AUTOMATE: AutomateHandler(),
            AgentCapability.ANALYZE: AnalyzeHandler(),
            AgentCapability.SECURITY: SecurityHandler(),
            AgentCapability.WORKFLOW: WorkflowHandler(),
            AgentCapability.COMMUNICATE: CommunicateHandler(),
            AgentCapability.CACHE: CacheHandler(),
        }
        self._execution_log: List[Dict[str, Any]] = []
        self._initialized = False

        if auto_initialize:
            self.initialize()

    def initialize(self) -> Dict[str, bool]:
        """Initialize all capability handlers."""
        results = {}
        for cap, handler in self._handlers.items():
            try:
                results[cap.value] = handler.initialize()
            except Exception as e:
                logger.error(f"Failed to initialize {cap.value}: {e}")
                results[cap.value] = False
        self._initialized = True
        return results

    def execute(self, task: AgentTask) -> AgentResult:
        """Execute a task using the appropriate capability handler."""
        handler = self._handlers.get(task.capability)
        if handler is None:
            return AgentResult(
                task_id=task.task_id,
                success=False,
                error=f"No handler for capability: {task.capability}",
                source="unified_agent_orchestrator",
            )

        if not handler.is_initialized:
            handler.initialize()

        result = handler.execute(task)

        # Log execution
        self._execution_log.append({
            "task_id": task.task_id,
            "capability": task.capability.value,
            "success": result.success,
            "duration": result.duration_seconds,
            "source": result.source,
            "timestamp": time.time(),
        })

        return result

    def execute_batch(self, tasks: List[AgentTask]) -> List[AgentResult]:
        """Execute multiple tasks sequentially."""
        return [self.execute(task) for task in tasks]

    def get_capabilities(self) -> List[str]:
        """Get list of available capabilities."""
        return [cap.value for cap in self._handlers.keys()]

    def get_status(self) -> Dict[str, Any]:
        """Get orchestrator status."""
        return {
            "initialized": self._initialized,
            "capabilities": self.get_capabilities(),
            "total_executions": len(self._execution_log),
            "successful_executions": sum(1 for e in self._execution_log if e["success"]),
            "failed_executions": sum(1 for e in self._execution_log if not e["success"]),
        }

    @property
    def execution_log(self) -> List[Dict[str, Any]]:
        return list(self._execution_log)


# ---------------------------------------------------------------------------
# Convenience function
# ---------------------------------------------------------------------------

def create_orchestrator(auto_initialize: bool = True) -> UnifiedAgentOrchestrator:
    """Create a pre-configured UnifiedAgentOrchestrator."""
    return UnifiedAgentOrchestrator(auto_initialize=auto_initialize)
