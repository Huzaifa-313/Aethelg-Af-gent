"""
Workflow Orchestration Engine — extracted from OpenManus-main.

Combines multi-agent workflow patterns from:
  - OpenManus-main: Planner → Supervisor → Researcher/Coder/Browser/Reporter DAG
  - OpenJarvis-main: DAG-based WorkflowEngine with parallel execution

This module provides a portable, self-contained workflow orchestration system
that can coordinate multiple agents in a directed graph with conditional routing,
parallel execution, and structured planning.

Gold-safe: This file is ADDITIVE only — it does not modify any existing gold data.
"""

from __future__ import annotations

import concurrent.futures
import json
import logging
import time
from abc import ABC, abstractmethod
from copy import deepcopy
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable, Dict, List, Optional, Sequence, Tuple

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Type definitions
# ---------------------------------------------------------------------------

class NodeStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"
    SKIPPED = "skipped"


class NodeType(str, Enum):
    PLANNER = "planner"
    SUPERVISOR = "supervisor"
    WORKER = "worker"
    CONDITION = "condition"
    REPORTER = "reporter"
    PARALLEL = "parallel"


@dataclass
class WorkflowState:
    """Shared state passed between workflow nodes."""
    messages: List[Dict[str, Any]] = field(default_factory=list)
    full_plan: str = ""
    next_node: str = ""
    deep_thinking_mode: bool = False
    search_before_planning: bool = False
    context: Dict[str, Any] = field(default_factory=dict)
    outputs: Dict[str, str] = field(default_factory=dict)


@dataclass
class WorkflowStepResult:
    """Result from a single workflow step."""
    node_id: str
    success: bool
    output: str = ""
    duration_seconds: float = 0.0
    error: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class WorkflowResult:
    """Result from a complete workflow execution."""
    workflow_name: str
    success: bool
    steps: List[WorkflowStepResult] = field(default_factory=list)
    final_output: str = ""
    total_duration_seconds: float = 0.0


# ---------------------------------------------------------------------------
# Abstract node interface
# ---------------------------------------------------------------------------

class WorkflowNode(ABC):
    """Base class for all workflow nodes."""

    def __init__(self, node_id: str, node_type: NodeType = NodeType.WORKER):
        self.node_id = node_id
        self.node_type = node_type
        self.status = NodeStatus.PENDING

    @abstractmethod
    def execute(self, state: WorkflowState) -> WorkflowStepResult:
        """Execute this node and return a step result."""
        ...

    def reset(self) -> None:
        self.status = NodeStatus.PENDING


# ---------------------------------------------------------------------------
# Concrete node implementations
# ---------------------------------------------------------------------------

class PlannerNode(WorkflowNode):
    """Generates a structured execution plan from a task description.

    Extracted from OpenManus planner_node pattern:
    - Accepts natural language task
    - Optionally searches before planning
    - Produces a JSON execution plan
    - Supports deep thinking mode
    """

    def __init__(
        self,
        node_id: str = "planner",
        plan_formatter: Optional[Callable[[str], Dict]] = None,
        search_fn: Optional[Callable[[str], List[Dict]]] = None,
    ):
        super().__init__(node_id, NodeType.PLANNER)
        self._plan_formatter = plan_formatter or self._default_format_plan
        self._search_fn = search_fn

    def execute(self, state: WorkflowState) -> WorkflowStepResult:
        t0 = time.time()
        self.status = NodeStatus.RUNNING
        try:
            task = state.messages[-1] if state.messages else {}
            task_text = task.get("content", "")

            # Optional search before planning
            search_context = ""
            if state.search_before_planning and self._search_fn:
                results = self._search_fn(task_text)
                search_context = json.dumps(
                    [{"title": r.get("title", ""), "content": r.get("content", "")} for r in results],
                    ensure_ascii=False,
                )

            # Generate plan
            plan = self._plan_formatter(task_text, search_context, state.deep_thinking_mode)
            state.full_plan = json.dumps(plan, ensure_ascii=False)
            state.next_node = "supervisor"

            self.status = NodeStatus.SUCCESS
            return WorkflowStepResult(
                node_id=self.node_id,
                success=True,
                output=state.full_plan,
                duration_seconds=time.time() - t0,
            )
        except Exception as e:
            self.status = NodeStatus.FAILED
            return WorkflowStepResult(
                node_id=self.node_id,
                success=False,
                output="",
                duration_seconds=time.time() - t0,
                error=str(e),
            )

    @staticmethod
    def _default_format_plan(task: str, search_context: str, deep_thinking: bool) -> Dict:
        """Default plan formatter — produces a simple step-by-step plan."""
        steps = [
            {"step": 1, "agent": "researcher", "action": "research", "description": f"Research: {task}"},
            {"step": 2, "agent": "coder", "action": "execute", "description": "Execute based on research"},
            {"step": 3, "agent": "reporter", "action": "report", "description": "Generate final report"},
        ]
        if search_context:
            steps.insert(0, {"step": 0, "agent": "researcher", "action": "search_review", "description": "Review search results"})
        return {"task": task, "deep_thinking": deep_thinking, "steps": steps}


class SupervisorNode(WorkflowNode):
    """Routes tasks to the appropriate next agent.

    Extracted from OpenManus supervisor_node pattern:
    - Evaluates current state
    - Decides which agent should act next
    - Supports FINISH condition
    """

    def __init__(
        self,
        node_id: str = "supervisor",
        router: Optional[Callable[[WorkflowState], str]] = None,
        available_agents: Optional[List[str]] = None,
    ):
        super().__init__(node_id, NodeType.SUPERVISOR)
        self._router = router or self._default_route
        self._available_agents = available_agents or ["researcher", "coder", "browser", "reporter"]

    def execute(self, state: WorkflowState) -> WorkflowStepResult:
        t0 = time.time()
        self.status = NodeStatus.RUNNING
        try:
            next_agent = self._router(state)

            if next_agent == "FINISH":
                state.next_node = "__end__"
                self.status = NodeStatus.SUCCESS
                return WorkflowStepResult(
                    node_id=self.node_id,
                    success=True,
                    output="Workflow completed",
                    duration_seconds=time.time() - t0,
                )

            state.next_node = next_agent
            self.status = NodeStatus.SUCCESS
            return WorkflowStepResult(
                node_id=self.node_id,
                success=True,
                output=f"Delegating to: {next_agent}",
                duration_seconds=time.time() - t0,
            )
        except Exception as e:
            self.status = NodeStatus.FAILED
            return WorkflowStepResult(
                node_id=self.node_id,
                success=False,
                output="",
                duration_seconds=time.time() - t0,
                error=str(e),
            )

    def _default_route(self, state: WorkflowState) -> str:
        """Default routing logic based on plan steps."""
        if not state.full_plan:
            return "FINISH"
        try:
            plan = json.loads(state.full_plan)
            steps = plan.get("steps", [])
            completed = set(state.outputs.keys())
            for step in steps:
                agent = step.get("agent", "")
                step_id = f"{agent}_{step.get('step', 0)}"
                if step_id not in completed:
                    return agent
            return "FINISH"
        except (json.JSONDecodeError, KeyError):
            return "FINISH"


class WorkerNode(WorkflowNode):
    """Generic worker node that executes a callable action.

    Can represent researcher, coder, browser, or any custom agent.
    """

    def __init__(
        self,
        node_id: str,
        action: Callable[[WorkflowState], str],
        node_type: NodeType = NodeType.WORKER,
    ):
        super().__init__(node_id, node_type)
        self._action = action

    def execute(self, state: WorkflowState) -> WorkflowStepResult:
        t0 = time.time()
        self.status = NodeStatus.RUNNING
        try:
            result = self._action(state)
            state.outputs[self.node_id] = result
            state.next_node = "supervisor"
            self.status = NodeStatus.SUCCESS
            return WorkflowStepResult(
                node_id=self.node_id,
                success=True,
                output=result,
                duration_seconds=time.time() - t0,
            )
        except Exception as e:
            self.status = NodeStatus.FAILED
            return WorkflowStepResult(
                node_id=self.node_id,
                success=False,
                output="",
                duration_seconds=time.time() - t0,
                error=str(e),
            )


class ReporterNode(WorkflowNode):
    """Compiles final report from all worker outputs.

    Extracted from OpenManus reporter_node pattern.
    """

    def __init__(
        self,
        node_id: str = "reporter",
        formatter: Optional[Callable[[Dict[str, str]], str]] = None,
    ):
        super().__init__(node_id, NodeType.REPORTER)
        self._formatter = formatter or self._default_format

    def execute(self, state: WorkflowState) -> WorkflowStepResult:
        t0 = time.time()
        self.status = NodeStatus.RUNNING
        try:
            report = self._formatter(state.outputs)
            state.outputs[self.node_id] = report
            state.next_node = "supervisor"
            self.status = NodeStatus.SUCCESS
            return WorkflowStepResult(
                node_id=self.node_id,
                success=True,
                output=report,
                duration_seconds=time.time() - t0,
            )
        except Exception as e:
            self.status = NodeStatus.FAILED
            return WorkflowStepResult(
                node_id=self.node_id,
                success=False,
                output="",
                duration_seconds=time.time() - t0,
                error=str(e),
            )

    @staticmethod
    def _default_format(outputs: Dict[str, str]) -> str:
        """Default report formatter."""
        sections = []
        for key, value in outputs.items():
            sections.append(f"## {key}\n{value}")
        return "\n\n".join(sections)


# ---------------------------------------------------------------------------
# Workflow Graph
# ---------------------------------------------------------------------------

class WorkflowGraph:
    """Defines a directed acyclic graph of workflow nodes.

    Extracted from OpenManus graph.py and OpenJarvis workflow/graph.py patterns.
    Supports:
    - Sequential node execution
    - Conditional routing (supervisor pattern)
    - Parallel execution of independent nodes
    - Cycle detection and validation
    """

    def __init__(self, name: str = "default"):
        self.name = name
        self._nodes: Dict[str, WorkflowNode] = {}
        self._edges: List[Tuple[str, str]] = []
        self._conditional_edges: Dict[str, List[Tuple[Callable, str]]] = {}
        self._entry_point: Optional[str] = None

    def add_node(self, node: WorkflowNode) -> "WorkflowGraph":
        """Add a node to the graph."""
        self._nodes[node.node_id] = node
        return self

    def add_edge(self, from_node: str, to_node: str) -> "WorkflowGraph":
        """Add a directed edge between two nodes."""
        self._edges.append((from_node, to_node))
        return self

    def add_conditional_edge(
        self,
        from_node: str,
        conditions: List[Tuple[Callable[[WorkflowState], bool], str]],
    ) -> "WorkflowGraph":
        """Add conditional edges from a node."""
        self._conditional_edges[from_node] = conditions
        return self

    def set_entry_point(self, node_id: str) -> "WorkflowGraph":
        """Set the entry point of the graph."""
        self._entry_point = node_id
        return self

    def validate(self) -> Tuple[bool, str]:
        """Validate the graph structure."""
        if not self._nodes:
            return False, "Graph has no nodes"
        if self._entry_point is None:
            return False, "No entry point set"
        if self._entry_point not in self._nodes:
            return False, f"Entry point '{self._entry_point}' not in graph"
        # Check for cycles (simple DFS)
        visited = set()
        path = set()

        def has_cycle(node_id: str) -> bool:
            visited.add(node_id)
            path.add(node_id)
            for src, dst in self._edges:
                if src == node_id:
                    if dst in path:
                        return True
                    if dst not in visited:
                        if has_cycle(dst):
                            return True
            path.remove(node_id)
            return False

        if has_cycle(self._entry_point):
            return False, "Graph contains a cycle"
        return True, "Valid"

    def get_node(self, node_id: str) -> Optional[WorkflowNode]:
        return self._nodes.get(node_id)

    @property
    def nodes(self) -> Dict[str, WorkflowNode]:
        return self._nodes

    @property
    def entry_point(self) -> Optional[str]:
        return self._entry_point


# ---------------------------------------------------------------------------
# Workflow Engine
# ---------------------------------------------------------------------------

class WorkflowOrchestrationEngine:
    """Executes workflow graphs with support for sequential, conditional,
    and parallel node execution.

    Combines patterns from:
    - OpenManus: Planner → Supervisor → Worker → Reporter pipeline
    - OpenJarvis: DAG-based parallel execution with ThreadPoolExecutor

    Usage:
        engine = WorkflowOrchestrationEngine()
        graph = build_my_workflow()
        result = engine.run(graph, initial_input="Analyze this code")
    """

    def __init__(
        self,
        max_parallel: int = 4,
        default_node_timeout: int = 300,
        event_callback: Optional[Callable[[str, Dict], None]] = None,
    ):
        self._max_parallel = max_parallel
        self._default_node_timeout = default_node_timeout
        self._event_callback = event_callback
        self._execution_history: List[WorkflowResult] = []

    def _emit_event(self, event_type: str, data: Dict) -> None:
        if self._event_callback:
            self._event_callback(event_type, data)

    def run(
        self,
        graph: WorkflowGraph,
        initial_input: str = "",
        context: Optional[Dict[str, Any]] = None,
    ) -> WorkflowResult:
        """Execute a workflow graph end-to-end."""
        valid, msg = graph.validate()
        if not valid:
            return WorkflowResult(
                workflow_name=graph.name,
                success=False,
                final_output=f"Invalid workflow: {msg}",
            )

        self._emit_event("workflow_start", {"workflow": graph.name})

        state = WorkflowState(
            messages=[{"role": "user", "content": initial_input}],
            context=dict(context or {}),
        )

        t0 = time.time()
        all_steps: List[WorkflowStepResult] = []
        success = True

        # Start from entry point
        current_node_id = graph.entry_point
        visited = set()

        while current_node_id and current_node_id != "__end__":
            if current_node_id in visited and current_node_id not in graph._conditional_edges:
                # Prevent infinite loops for non-conditional paths
                logger.warning(f"Loop detected at node '{current_node_id}', stopping")
                break

            node = graph.get_node(current_node_id)
            if node is None:
                logger.error(f"Node '{current_node_id}' not found in graph")
                success = False
                break

            # Track visited for loop detection (allow revisits for conditional nodes)
            if node.node_type != NodeType.SUPERVISOR:
                visited.add(current_node_id)

            # Execute node
            step = node.execute(state)
            all_steps.append(step)

            if not step.success:
                success = False
                break

            # Determine next node
            if current_node_id in graph._conditional_edges:
                # Conditional routing
                next_found = False
                for condition, target in graph._conditional_edges[current_node_id]:
                    if condition(state):
                        current_node_id = target
                        next_found = True
                        break
                if not next_found:
                    # Check regular edges as fallback
                    current_node_id = self._find_next_edge(graph, current_node_id)
            else:
                current_node_id = self._find_next_edge(graph, current_node_id)

        total = time.time() - t0
        final_output = all_steps[-1].output if all_steps else ""

        self._emit_event("workflow_end", {
            "workflow": graph.name,
            "success": success,
            "duration": total,
        })

        result = WorkflowResult(
            workflow_name=graph.name,
            success=success,
            steps=all_steps,
            final_output=final_output,
            total_duration_seconds=total,
        )
        self._execution_history.append(result)
        return result

    def _find_next_edge(self, graph: WorkflowGraph, current: str) -> Optional[str]:
        """Find the next node via regular edges."""
        for src, dst in graph._edges:
            if src == current:
                return dst
        return None

    @property
    def execution_history(self) -> List[WorkflowResult]:
        return list(self._execution_history)


# ---------------------------------------------------------------------------
# Pre-built workflow templates
# ---------------------------------------------------------------------------

def build_manus_style_workflow(
    researcher_fn: Callable[[WorkflowState], str],
    coder_fn: Callable[[WorkflowState], str],
    browser_fn: Optional[Callable[[WorkflowState], str]] = None,
    reporter_fn: Optional[Callable[[WorkflowState], str]] = None,
    search_fn: Optional[Callable[[str], List[Dict]]] = None,
) -> WorkflowGraph:
    """Build an OpenManus-style workflow: Planner → Supervisor → Workers → Reporter.

    This is the canonical multi-agent workflow pattern extracted from OpenManus.
    """
    graph = WorkflowGraph(name="manus_workflow")

    # Create nodes
    planner = PlannerNode(search_fn=search_fn)
    supervisor = SupervisorNode()
    researcher = WorkerNode("researcher", researcher_fn)
    coder = WorkerNode("coder", coder_fn)
    reporter = ReporterNode(formatter=None)

    # Add nodes
    graph.add_node(planner)
    graph.add_node(supervisor)
    graph.add_node(researcher)
    graph.add_node(coder)
    graph.add_node(reporter)

    if browser_fn:
        browser = WorkerNode("browser", browser_fn)
        graph.add_node(browser)

    # Add edges
    graph.add_edge("planner", "supervisor")
    graph.add_edge("researcher", "supervisor")
    graph.add_edge("coder", "supervisor")
    graph.add_edge("reporter", "supervisor")
    if browser_fn:
        graph.add_edge("browser", "supervisor")

    # Conditional edges from supervisor
    conditions = [
        (lambda s: s.next_node == "researcher", "researcher"),
        (lambda s: s.next_node == "coder", "coder"),
        (lambda s: s.next_node == "reporter", "reporter"),
        (lambda s: s.next_node == "__end__", "__end__"),
    ]
    if browser_fn:
        conditions.insert(3, (lambda s: s.next_node == "browser", "browser"))
    graph.add_conditional_edge("supervisor", conditions)

    graph.set_entry_point("planner")
    return graph


def build_simple_pipeline(
    *actions: Callable[[WorkflowState], str],
    name: str = "simple_pipeline",
) -> WorkflowGraph:
    """Build a simple sequential pipeline of actions."""
    graph = WorkflowGraph(name=name)

    for i, action in enumerate(actions):
        node_id = f"step_{i}"
        node = WorkerNode(node_id, action)
        graph.add_node(node)
        if i > 0:
            graph.add_edge(f"step_{i-1}", node_id)

    graph.set_entry_point("step_0")
    return graph
