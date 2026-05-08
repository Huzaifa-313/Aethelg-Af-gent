#!/usr/bin/env python3
"""
MCP MASTER - ECOSYSTEM CONTROL DASHBOARD
========================================
Command line dashboard for monitoring the entire ecosystem
in real-time.

Responsibilities:
- Display real-time ecosystem status
- Show tool health, gaps, and installations
- Monitor safety events and quarantine status
- Provide interactive controls
"""

import json
import os
import sys
import time
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
import yaml

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))


class Dashboard:
    """
    Ecosystem Control Dashboard for the MCP Master.
    
    Provides real-time monitoring and control of the ecosystem.
    """
    
    def __init__(self, config_path: str = "./ecosystem_config.yaml"):
        """Initialize the Dashboard."""
        self.config = self._load_config(config_path)
        self.dashboard_config = self.config.get("dashboard", {})
        self.master_dir = Path(self.config.get("paths", {}).get("master_dir", "./"))
        
        print("[Dashboard] Initialized")
    
    def _load_config(self, config_path: str) -> Dict:
        """Load configuration from YAML file."""
        try:
            with open(config_path, 'r') as f:
                return yaml.safe_load(f).get("ecosystem", {})
        except Exception as e:
            print(f"[Dashboard] Warning: Could not load config: {e}")
            return {}
    
    def _clear_screen(self):
        """Clear the terminal screen."""
        os.system('cls' if os.name == 'nt' else 'clear')
    
    def _get_tool_registry(self) -> Dict:
        """Load tool registry."""
        registry_file = self.master_dir / "registry" / "tool_registry.json"
        if registry_file.exists():
            try:
                with open(registry_file, 'r') as f:
                    return json.load(f)
            except Exception:
                pass
        return {}
    
    def _get_gaps(self) -> List[Dict]:
        """Load capability gaps."""
        gaps_file = self.master_dir / "ecosystem" / "gaps.json"
        if gaps_file.exists():
            try:
                with open(gaps_file, 'r') as f:
                    data = json.load(f)
                    return data.get("gaps", [])
            except Exception:
                pass
        return []
    
    def _get_safety_status(self) -> Dict:
        """Load safety status."""
        safety_file = self.master_dir / "ecosystem" / "safety_state.json"
        if safety_file.exists():
            try:
                with open(safety_file, 'r') as f:
                    return json.load(f)
            except Exception:
                pass
        return {}
    
    def _get_installation_log(self) -> List[str]:
        """Load installation log."""
        log_file = self.master_dir / "logs" / "installations.log"
        if log_file.exists():
            try:
                with open(log_file, 'r') as f:
                    return f.readlines()[-20:]  # Last 20 lines
            except Exception:
                pass
        return []
    
    def display_header(self):
        """Display dashboard header."""
        print("=" * 80)
        print("  MCP MASTER - ECOSYSTEM CONTROL DASHBOARD")
        print("  " + datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        print("=" * 80)
        print()
    
    def display_tool_status(self):
        """Display tool status section."""
        print("  [TOOLS]")
        print("  " + "-" * 76)
        
        registry = self._get_tool_registry()
        tools = registry.get("tools", {})
        
        if not tools:
            print("  No tools registered")
            return
        
        healthy = 0
        unhealthy = 0
        
        for tool_name, tool_data in list(tools.items())[:10]:
            performance = tool_data.get("performance", {})
            health = performance.get("health", "unknown")
            
            if health == "healthy":
                healthy += 1
                status = "✓"
            else:
                unhealthy += 1
                status = "✗"
            
            print(f"  {status} {tool_name:<30} [{health}]")
        
        print(f"\n  Total: {len(tools)} | Healthy: {healthy} | Unhealthy: {unhealthy}")
        print()
    
    def display_gaps(self):
        """Display capability gaps section."""
        print("  [CAPABILITY GAPS]")
        print("  " + "-" * 76)
        
        gaps = self._get_gaps()
        
        if not gaps:
            print("  No gaps detected")
            return
        
        open_gaps = [g for g in gaps if g.get("status") == "open"]
        
        for gap in open_gaps[:5]:
            print(f"  ! {gap.get('category', 'unknown'):<20} "
                  f"(confidence: {gap.get('confidence', 0):.2f}) "
                  f"[{gap.get('priority', 'low')}]")
        
        print(f"\n  Total gaps: {len(gaps)} | Open: {len(open_gaps)}")
        print()
    
    def display_safety(self):
        """Display safety status section."""
        print("  [SAFETY STATUS]")
        print("  " + "-" * 76)
        
        safety = self._get_safety_status()
        quarantined = safety.get("quarantined_tools", {})
        
        if quarantined:
            print(f"  ⚠ {len(quarantined)} tool(s) in quarantine")
            for tool_name in list(quarantined.keys())[:5]:
                print(f"    - {tool_name}")
        else:
            print("  ✓ All tools safe")
        
        print()
    
    def display_installations(self):
        """Display recent installations."""
        print("  [RECENT INSTALLATIONS]")
        print("  " + "-" * 76)
        
        logs = self._get_installation_log()
        
        if not logs:
            print("  No recent installations")
            return
        
        for log in logs[-5:]:
            print(f"  {log.strip()}")
        
        print()
    
    def display_footer(self):
        """Display dashboard footer."""
        print("=" * 80)
        print("  Commands: [R]efresh | [Q]uit")
        print("=" * 80)
    
    def render(self):
        """Render the full dashboard."""
        self._clear_screen()
        self.display_header()
        self.display_tool_status()
        self.display_gaps()
        self.display_safety()
        self.display_installations()
        self.display_footer()
    
    def run(self):
        """Run the dashboard in interactive mode."""
        import select
        
        try:
            while True:
                self.render()
                
                # Wait for input or refresh
                print("Refreshing in 5 seconds... (Press 'q' to quit, 'r' to refresh)")
                
                # Simple input handling
                try:
                    import msvcrt
                    if msvcrt.kbhit():
                        key = msvcrt.getch().decode().lower()
                        if key == 'q':
                            break
                        elif key == 'r':
                            continue
                except ImportError:
                    pass
                
                time.sleep(5)
                
        except KeyboardInterrupt:
            print("\nDashboard closed.")
    
    def get_status_summary(self) -> Dict:
        """Get a summary of ecosystem status."""
        registry = self._get_tool_registry()
        tools = registry.get("tools", {})
        
        healthy = sum(1 for t in tools.values() 
                       if t.get("performance", {}).get("health") == "healthy")
        
        gaps = self._get_gaps()
        open_gaps = [g for g in gaps if g.get("status") == "open"]
        
        safety = self._get_safety_status()
        quarantined = safety.get("quarantined_tools", {})
        
        return {
            "total_tools": len(tools),
            "healthy_tools": healthy,
            "total_gaps": len(gaps),
            "open_gaps": len(open_gaps),
            "quarantined_tools": len(quarantined),
            "timestamp": datetime.now().isoformat()
        }


def main():
    """CLI entry point for the Dashboard."""
    dashboard = Dashboard()
    
    import argparse
    parser = argparse.ArgumentParser(description="MCP Master Dashboard")
    parser.add_argument("command", choices=["show", "summary", "interactive"])
    
    args = parser.parse_args()
    
    if args.command == "show":
        dashboard.render()
    
    elif args.command == "summary":
        print(json.dumps(dashboard.get_status_summary(), indent=2))
    
    elif args.command == "interactive":
        dashboard.run()


if __name__ == "__main__":
    main()
