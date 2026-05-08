#!/usr/bin/env python3
"""
MCP MASTER - DAILY INTELLIGENCE UPGRADE SYSTEM
===============================================
Runs a daily cycle to upgrade tools, refresh knowledge,
and optimize the ecosystem.

Responsibilities:
- Check for tool updates daily
- Upgrade tools automatically
- Refresh knowledge base
- Optimize ecosystem performance
- Generate daily reports
"""

import json
import os
import sys
import time
import subprocess
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
import yaml

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))


@dataclass
class UpgradeRecord:
    """Represents a tool upgrade record."""
    tool_name: str
    old_version: str
    new_version: str
    upgraded_at: str
    status: str  # 'success', 'failed', 'skipped'
    error_message: Optional[str]


class DailyUpgrade:
    """
    Daily Intelligence Upgrade System for the MCP Master ecosystem.
    
    Runs daily cycles to upgrade tools, refresh knowledge,
    and optimize the ecosystem.
    """
    
    def __init__(self, config_path: str = "./ecosystem_config.yaml"):
        """Initialize the Daily Upgrade system."""
        self.config = self._load_config(config_path)
        self.upgrade_config = self.config.get("daily_upgrade", {})
        self.master_dir = Path(self.config.get("paths", {}).get("master_dir", "./"))
        self.logs_dir = Path(self.config.get("paths", {}).get("logs_dir", "./logs"))
        
        # Upgrade history
        self.upgrades: List[UpgradeRecord] = []
        
        print("[DailyUpgrade] Initialized")
    
    def _load_config(self, config_path: str) -> Dict:
        """Load configuration from YAML file."""
        try:
            with open(config_path, 'r') as f:
                return yaml.safe_load(f).get("ecosystem", {})
        except Exception as e:
            print(f"[DailyUpgrade] Warning: Could not load config: {e}")
            return {}
    
    def check_for_updates(self, tool_name: str, tool_path: str) -> Dict:
        """
        Check if a tool has updates available.
        
        Args:
            tool_name: Name of the tool
            tool_path: Path to the tool directory
            
        Returns:
            Update information
        """
        print(f"[DailyUpgrade] Checking for updates: {tool_name}")
        
        tool_dir = Path(tool_path)
        
        # Check for package.json (Node.js tools)
        package_json = tool_dir / "package.json"
        if package_json.exists():
            try:
                with open(package_json, 'r') as f:
                    package_data = json.load(f)
                current_version = package_data.get("version", "unknown")
                
                # Check npm for updates
                result = subprocess.run(
                    ["npm", "view", package_data.get("name", ""), "version"],
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                
                if result.returncode == 0:
                    latest_version = result.stdout.strip()
                    if latest_version != current_version:
                        return {
                            "has_update": True,
                            "current_version": current_version,
                            "latest_version": latest_version,
                            "source": "npm"
                        }
                
            except Exception as e:
                print(f"[DailyUpgrade] Error checking npm updates: {e}")
        
        # Check for requirements.txt (Python tools)
        requirements = tool_dir / "requirements.txt"
        if requirements.exists():
            # For Python tools, we'd check PyPI
            # This is a simplified check
            pass
        
        return {
            "has_update": False,
            "current_version": "unknown",
            "latest_version": "unknown"
        }
    
    def upgrade_tool(self, tool_name: str, tool_path: str) -> Dict:
        """
        Upgrade a tool to its latest version.
        
        Args:
            tool_name: Name of the tool
            tool_path: Path to the tool directory
            
        Returns:
            Upgrade result
        """
        print(f"[DailyUpgrade] Upgrading tool: {tool_name}")
        
        tool_dir = Path(tool_path)
        
        # Check for updates first
        update_info = self.check_for_updates(tool_name, tool_path)
        
        if not update_info["has_update"]:
            print(f"[DailyUpgrade] No updates available for {tool_name}")
            return {
                "success": True,
                "upgraded": False,
                "message": "No updates available"
            }
        
        try:
            # Create backup
            backup_dir = self.master_dir / "retired" / "backups"
            backup_dir.mkdir(parents=True, exist_ok=True)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_path = backup_dir / f"{tool_name}_{timestamp}"
            
            import shutil
            shutil.copytree(tool_dir, backup_path)
            
            # Run upgrade based on tool type
            package_json = tool_dir / "package.json"
            if package_json.exists():
                # Node.js tool - run npm update
                result = subprocess.run(
                    ["npm", "update"],
                    cwd=str(tool_dir),
                    capture_output=True,
                    text=True,
                    timeout=300
                )
                
                if result.returncode != 0:
                    raise Exception(f"npm update failed: {result.stderr}")
            
            # Record upgrade
            record = UpgradeRecord(
                tool_name=tool_name,
                old_version=update_info["current_version"],
                new_version=update_info["latest_version"],
                upgraded_at=datetime.now().isoformat(),
                status="success",
                error_message=None
            )
            self.upgrades.append(record)
            
            print(f"[DailyUpgrade] Successfully upgraded {tool_name} to {update_info['latest_version']}")
            return {
                "success": True,
                "upgraded": True,
                "old_version": update_info["current_version"],
                "new_version": update_info["latest_version"]
            }
            
        except Exception as e:
            # Restore backup
            if backup_path.exists():
                if tool_dir.exists():
                    shutil.rmtree(tool_dir)
                shutil.copytree(backup_path, tool_dir)
            
            record = UpgradeRecord(
                tool_name=tool_name,
                old_version=update_info.get("current_version", "unknown"),
                new_version=update_info.get("latest_version", "unknown"),
                upgraded_at=datetime.now().isoformat(),
                status="failed",
                error_message=str(e)
            )
            self.upgrades.append(record)
            
            print(f"[DailyUpgrade] Upgrade failed for {tool_name}: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def run_daily_cycle(self, tools: List[Dict]) -> Dict:
        """
        Run the daily upgrade cycle.
        
        Args:
            tools: List of tools to check for updates
            
        Returns:
            Cycle results
        """
        print("[DailyUpgrade] Starting daily upgrade cycle")
        
        max_upgrades = self.upgrade_config.get("max_upgrades_per_day", 5)
        upgraded_count = 0
        failed_count = 0
        skipped_count = 0
        
        for tool in tools:
            if upgraded_count >= max_upgrades:
                print(f"[DailyUpgrade] Reached max upgrades per day ({max_upgrades})")
                break
            
            tool_name = tool.get("name", "unknown")
            tool_path = tool.get("path", "")
            
            if not tool_path:
                continue
            
            try:
                result = self.upgrade_tool(tool_name, tool_path)
                
                if result.get("upgraded"):
                    upgraded_count += 1
                else:
                    skipped_count += 1
                    
            except Exception as e:
                print(f"[DailyUpgrade] Error upgrading {tool_name}: {e}")
                failed_count += 1
        
        print(f"[DailyUpgrade] Daily cycle complete: {upgraded_count} upgraded, {failed_count} failed, {skipped_count} skipped")
        
        return {
            "upgraded": upgraded_count,
            "failed": failed_count,
            "skipped": skipped_count,
            "timestamp": datetime.now().isoformat()
        }
    
    def get_upgrade_history(self) -> List[Dict]:
        """Get upgrade history."""
        return [asdict(record) for record in self.upgrades]
    
    def get_upgrade_summary(self) -> Dict:
        """Get upgrade summary."""
        successful = len([r for r in self.upgrades if r.status == "success"])
        failed = len([r for r in self.upgrades if r.status == "failed"])
        
        return {
            "total_upgrades": len(self.upgrades),
            "successful": successful,
            "failed": failed,
            "success_rate": successful / len(self.upgrades) if self.upgrades else 0.0
        }


def main():
    """CLI entry point for Daily Upgrade."""
    upgrader = DailyUpgrade()
    
    import argparse
    parser = argparse.ArgumentParser(description="MCP Master Daily Upgrade")
    parser.add_argument("command", choices=["check", "upgrade", "cycle", "history", "summary"])
    parser.add_argument("--tool", help="Tool name")
    parser.add_argument("--path", help="Tool path")
    parser.add_argument("--tools-file", help="JSON file with tools list")
    
    args = parser.parse_args()
    
    if args.command == "check":
        if not args.tool or not args.path:
            print("Error: --tool and --path required")
            return
        result = upgrader.check_for_updates(args.tool, args.path)
        print(json.dumps(result, indent=2))
    
    elif args.command == "upgrade":
        if not args.tool or not args.path:
            print("Error: --tool and --path required")
            return
        result = upgrader.upgrade_tool(args.tool, args.path)
        print(json.dumps(result, indent=2))
    
    elif args.command == "cycle":
        if not args.tools_file:
            print("Error: --tools-file required")
            return
        
        with open(args.tools_file, 'r') as f:
            tools = json.load(f)
        
        result = upgrader.run_daily_cycle(tools)
        print(json.dumps(result, indent=2))
    
    elif args.command == "history":
        history = upgrader.get_upgrade_history()
        print(json.dumps(history, indent=2))
    
    elif args.command == "summary":
        print(json.dumps(upgrader.get_upgrade_summary(), indent=2))


if __name__ == "__main__":
    main()
