# AETHELGARD MERGED FILE
# Origin Repository: OpenJarvis-main
# Original Path: tests\agents\test_scenario_harness_smoke.py
# Merge Date: 2026-05-07T19:13:17.128457
# ---

"""Smoke test for the scenario harness fixture."""

from __future__ import annotations

from tests.agents.scenario_harness import ScenarioHarness


def test_harness_creates_and_runs_agent(scenario_harness: ScenarioHarness):
    """Verify the harness wires up correctly — create agent, run tick."""
    h = scenario_harness
    agent = h.manager.create_agent(
        "Smoke Test",
        config={
            "schedule_type": "manual",
            "instruction": "Say hello.",
        },
    )
    h.executor.execute_tick(agent["id"])
    updated = h.manager.get_agent(agent["id"])
    assert updated["status"] == "idle"
    assert updated["total_runs"] == 1
    assert updated["summary_memory"] != ""
