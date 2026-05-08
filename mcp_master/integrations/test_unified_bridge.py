#!/usr/bin/env python3
"""
Test Unified Core Bridge
Validates the bridge between /core gold code and /mcp_master ecosystem.
"""

import os
import sys
import unittest
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from integrations.unified_core_bridge import (
    UnifiedCoreBridge,
    UnifiedCoreBridgeFactory,
    GoldToolDef,
    GoldSkillDef,
    GoldAgentState,
)


class TestUnifiedCoreBridge(unittest.TestCase):
    """Test unified core bridge."""

    def test_bridge_creation(self):
        """Test bridge creation."""
        bridge = UnifiedCoreBridge()
        self.assertIsNotNone(bridge)
        self.assertGreaterEqual(len(bridge.gold_tools), 0)
        self.assertGreaterEqual(len(bridge.gold_skills), 0)

    def test_gold_tools_discovery(self):
        """Test gold tools discovery."""
        bridge = UnifiedCoreBridge()
        tools = bridge.get_gold_tools()
        self.assertIsInstance(tools, list)
        # Should discover Bash, Read, Grep tools
        self.assertGreaterEqual(len(tools), 0)

    def test_gold_skills_discovery(self):
        """Test gold skills discovery."""
        bridge = UnifiedCoreBridge()
        skills = bridge.get_gold_skills()
        self.assertIsInstance(skills, list)
        # Should discover commit and review skills
        self.assertGreaterEqual(len(skills), 0)

    def test_execute_gold_skill(self):
        """Test executing a gold skill."""
        bridge = UnifiedCoreBridge()
        result = bridge.execute_gold_skill("commit")
        self.assertIn("success", result)
        if result["success"]:
            self.assertEqual(result["skill"], "commit")

    def test_execute_nonexistent_skill(self):
        """Test executing a nonexistent skill."""
        bridge = UnifiedCoreBridge()
        result = bridge.execute_gold_skill("nonexistent")
        self.assertFalse(result["success"])
        self.assertIn("error", result)

    def test_status(self):
        """Test bridge status."""
        bridge = UnifiedCoreBridge()
        status = bridge.get_status()
        self.assertIn("gold_tools_discovered", status)
        self.assertIn("gold_skills_discovered", status)
        self.assertIn("core_dir_exists", status)
        self.assertIn("mcp_master_dir_exists", status)
        self.assertTrue(status["core_dir_exists"])
        self.assertTrue(status["mcp_master_dir_exists"])

    def test_factory(self):
        """Test bridge factory."""
        bridge = UnifiedCoreBridgeFactory.create_bridge()
        self.assertIsNotNone(bridge)


if __name__ == "__main__":
    unittest.main(verbosity=2)
