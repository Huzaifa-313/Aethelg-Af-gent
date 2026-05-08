#!/usr/bin/env python3
"""
MCP MASTER - SELF-INSTALLING DEPLOYMENT SYSTEM
===============================================
Automatically installs approved tools into the ecosystem
with backup and rollback capability.

Responsibilities:
- Install tools from various sources (git, npm, pip)
- Create backups before installation
- Rollback on failure
- Update registry after successful installation
- Log all installation activity
"""

import json
import os
import sys
import shutil
import subprocess
import tempfile
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
import yaml

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))


@dataclass
class InstallationRecord:
    """Represents an installation record."""
    tool_name: str
    version: str
    installed_at: str
    source: str
    install_path: str
    backup_path: Optional[str]
    status: str  # 'success', 'failed', 'rolled_back'
    error_message: Optional[str]


class AutoInstaller:
    """
    Self-Installing Deployment System for the MCP Master ecosystem.
    
    Automatically installs approved tools with backup and rollback.
    """
    
    def __init__(self, config_path: str = "./ecosystem_config.yaml"):
        """Initialize the Auto Installer."""
        self.config = self._load_config(config_path)
        self.installer_config = self.config.get("auto_installer", {})
        self.master_dir = Path(self.config.get("paths", {}).get("master_dir", "./"))
        self.logs_dir = Path(self.config.get("paths", {}).get("logs_dir", "./logs"))
        self.registry_file = Path(self.config.get("paths", {}).get("registry_file", "./registry/tool_registry.json"))
        self.installations_log = Path(self.config.get("paths", {}).get("installations_log", "./logs/installations.log"))
        
        # Ensure directories exist
        self.logs_dir.mkdir(parents=True, exist_ok=True)
        
        # Installation history
        self.installations: List[InstallationRecord] = []
        
        print("[AutoInstaller] Initialized")
    
    def _load_config(self, config_path: str) -> Dict:
        """Load configuration from YAML file."""
        try:
            with open(config_path, 'r') as f:
                return yaml.safe_load(f).get("ecosystem", {})
        except Exception as e:
            print(f"[AutoInstaller] Warning: Could not load config: {e}")
            return {}
    
    def _log_installation(self, record: InstallationRecord):
        """Log an installation record."""
        self.installations.append(record)
        
        try:
            with open(self.installations_log, 'a') as f:
                f.write(f"{record.installed_at} [{record.status.upper()}] "
                       f"{record.tool_name} v{record.version} from {record.source}\n")
        except Exception as e:
            print(f"[AutoInstaller] Warning: Could not write to log: {e}")
    
    def _create_backup(self, tool_path: Path) -> Optional[Path]:
        """Create a backup of an existing tool."""
        if not tool_path.exists():
            return None
        
        backup_dir = self.master_dir / "retired" / "backups"
        backup_dir.mkdir(parents=True, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = backup_dir / f"{tool_path.name}_{timestamp}"
        
        try:
            shutil.copytree(tool_path, backup_path)
            print(f"[AutoInstaller] Backup created: {backup_path}")
            return backup_path
        except Exception as e:
            print(f"[AutoInstaller] Warning: Could not create backup: {e}")
            return None
    
    def _rollback(self, tool_path: Path, backup_path: Optional[Path]) -> bool:
        """Rollback to backup."""
        if not backup_path or not backup_path.exists():
            print("[AutoInstaller] No backup available for rollback")
            return False
        
        try:
            # Remove failed installation
            if tool_path.exists():
                shutil.rmtree(tool_path)
            
            # Restore backup
            shutil.copytree(backup_path, tool_path)
            print(f"[AutoInstaller] Rolled back to: {backup_path}")
            return True
        except Exception as e:
            print(f"[AutoInstaller] Rollback failed: {e}")
            return False
    
    def install_from_git(self, tool_name: str, repo_url: str, 
                         target_dir: str) -> Dict:
        """
        Install a tool from a Git repository.
        
        Args:
            tool_name: Name of the tool
            repo_url: Git repository URL
            target_dir: Target directory for installation
            
        Returns:
            Installation result
        """
        print(f"[AutoInstaller] Installing {tool_name} from Git: {repo_url}")
        
        target_path = Path(target_dir)
        backup_path = None
        
        try:
            # Create backup if tool already exists
            if target_path.exists():
                backup_path = self._create_backup(target_path)
            
            # Clone repository
            result = subprocess.run(
                ["git", "clone", repo_url, str(target_path)],
                capture_output=True,
                text=True,
                timeout=300
            )
            
            if result.returncode != 0:
                raise Exception(f"Git clone failed: {result.stderr}")
            
            # Record successful installation
            record = InstallationRecord(
                tool_name=tool_name,
                version="latest",
                installed_at=datetime.now().isoformat(),
                source=repo_url,
                install_path=str(target_path),
                backup_path=str(backup_path) if backup_path else None,
                status="success",
                error_message=None
            )
            self._log_installation(record)
            
            print(f"[AutoInstaller] Successfully installed {tool_name}")
            return {
                "success": True,
                "tool_name": tool_name,
                "install_path": str(target_path),
                "backup_path": str(backup_path) if backup_path else None
            }
            
        except Exception as e:
            # Attempt rollback
            if backup_path:
                self._rollback(target_path, backup_path)
            
            record = InstallationRecord(
                tool_name=tool_name,
                version="latest",
                installed_at=datetime.now().isoformat(),
                source=repo_url,
                install_path=str(target_path),
                backup_path=str(backup_path) if backup_path else None,
                status="failed",
                error_message=str(e)
            )
            self._log_installation(record)
            
            print(f"[AutoInstaller] Installation failed: {e}")
            return {
                "success": False,
                "error": str(e),
                "tool_name": tool_name
            }
    
    def install_from_npm(self, tool_name: str, package_name: str,
                         target_dir: str) -> Dict:
        """
        Install a tool from NPM.
        
        Args:
            tool_name: Name of the tool
            package_name: NPM package name
            target_dir: Target directory for installation
            
        Returns:
            Installation result
        """
        print(f"[AutoInstaller] Installing {tool_name} from NPM: {package_name}")
        
        target_path = Path(target_dir)
        backup_path = None
        
        try:
            # Create backup if tool already exists
            if target_path.exists():
                backup_path = self._create_backup(target_path)
            
            # Install with npm
            target_path.mkdir(parents=True, exist_ok=True)
            result = subprocess.run(
                ["npm", "install", package_name],
                cwd=str(target_path),
                capture_output=True,
                text=True,
                timeout=300
            )
            
            if result.returncode != 0:
                raise Exception(f"NPM install failed: {result.stderr}")
            
            record = InstallationRecord(
                tool_name=tool_name,
                version="latest",
                installed_at=datetime.now().isoformat(),
                source=f"npm:{package_name}",
                install_path=str(target_path),
                backup_path=str(backup_path) if backup_path else None,
                status="success",
                error_message=None
            )
            self._log_installation(record)
            
            print(f"[AutoInstaller] Successfully installed {tool_name}")
            return {
                "success": True,
                "tool_name": tool_name,
                "install_path": str(target_path)
            }
            
        except Exception as e:
            if backup_path:
                self._rollback(target_path, backup_path)
            
            record = InstallationRecord(
                tool_name=tool_name,
                version="latest",
                installed_at=datetime.now().isoformat(),
                source=f"npm:{package_name}",
                install_path=str(target_path),
                backup_path=str(backup_path) if backup_path else None,
                status="failed",
                error_message=str(e)
            )
            self._log_installation(record)
            
            return {
                "success": False,
                "error": str(e),
                "tool_name": tool_name
            }
    
    def install_from_pip(self, tool_name: str, package_name: str,
                         target_dir: str) -> Dict:
        """
        Install a tool from PyPI.
        
        Args:
            tool_name: Name of the tool
            package_name: PyPI package name
            target_dir: Target directory for installation
            
        Returns:
            Installation result
        """
        print(f"[AutoInstaller] Installing {tool_name} from PyPI: {package_name}")
        
        target_path = Path(target_dir)
        backup_path = None
        
        try:
            # Create backup if tool already exists
            if target_path.exists():
                backup_path = self._create_backup(target_path)
            
            # Install with pip
            target_path.mkdir(parents=True, exist_ok=True)
            result = subprocess.run(
                [sys.executable, "-m", "pip", "install", package_name, "-t", str(target_path)],
                capture_output=True,
                text=True,
                timeout=300
            )
            
            if result.returncode != 0:
                raise Exception(f"Pip install failed: {result.stderr}")
            
            record = InstallationRecord(
                tool_name=tool_name,
                version="latest",
                installed_at=datetime.now().isoformat(),
                source=f"pip:{package_name}",
                install_path=str(target_path),
                backup_path=str(backup_path) if backup_path else None,
                status="success",
                error_message=None
            )
            self._log_installation(record)
            
            print(f"[AutoInstaller] Successfully installed {tool_name}")
            return {
                "success": True,
                "tool_name": tool_name,
                "install_path": str(target_path)
            }
            
        except Exception as e:
            if backup_path:
                self._rollback(target_path, backup_path)
            
            record = InstallationRecord(
                tool_name=tool_name,
                version="latest",
                installed_at=datetime.now().isoformat(),
                source=f"pip:{package_name}",
                install_path=str(target_path),
                backup_path=str(backup_path) if backup_path else None,
                status="failed",
                error_message=str(e)
            )
            self._log_installation(record)
            
            return {
                "success": False,
                "error": str(e),
                "tool_name": tool_name
            }
    
    def update_registry(self, tool_name: str, tool_data: Dict) -> bool:
        """
        Update the tool registry after installation.
        
        Args:
            tool_name: Name of the tool
            tool_data: Tool metadata
            
        Returns:
            True if successful
        """
        try:
            registry = {}
            if self.registry_file.exists():
                with open(self.registry_file, 'r') as f:
                    registry = json.load(f)
            
            if "tools" not in registry:
                registry["tools"] = {}
            
            registry["tools"][tool_name] = tool_data
            registry["last_updated"] = datetime.now().isoformat()
            
            with open(self.registry_file, 'w') as f:
                json.dump(registry, f, indent=2)
            
            print(f"[AutoInstaller] Registry updated for {tool_name}")
            return True
            
        except Exception as e:
            print(f"[AutoInstaller] Warning: Could not update registry: {e}")
            return False
    
    def get_installation_history(self) -> List[Dict]:
        """Get installation history."""
        return [asdict(record) for record in self.installations]
    
    def get_installation_summary(self) -> Dict:
        """Get installation summary."""
        successful = len([r for r in self.installations if r.status == "success"])
        failed = len([r for r in self.installations if r.status == "failed"])
        
        return {
            "total_installations": len(self.installations),
            "successful": successful,
            "failed": failed,
            "success_rate": successful / len(self.installations) if self.installations else 0.0
        }


def main():
    """CLI entry point for the Auto Installer."""
    installer = AutoInstaller()
    
    import argparse
    parser = argparse.ArgumentParser(description="MCP Master Auto Installer")
    parser.add_argument("command", choices=["install", "history", "summary"])
    parser.add_argument("--tool", help="Tool name")
    parser.add_argument("--source", help="Source URL or package name")
    parser.add_argument("--type", choices=["git", "npm", "pip"], default="git", help="Installation type")
    parser.add_argument("--target", help="Target directory")
    
    args = parser.parse_args()
    
    if args.command == "install":
        if not args.tool or not args.source or not args.target:
            print("Error: --tool, --source, and --target required")
            return
        
        if args.type == "git":
            result = installer.install_from_git(args.tool, args.source, args.target)
        elif args.type == "npm":
            result = installer.install_from_npm(args.tool, args.source, args.target)
        elif args.type == "pip":
            result = installer.install_from_pip(args.tool, args.source, args.target)
        
        print(json.dumps(result, indent=2))
    
    elif args.command == "history":
        history = installer.get_installation_history()
        print(json.dumps(history, indent=2))
    
    elif args.command == "summary":
        print(json.dumps(installer.get_installation_summary(), indent=2))


if __name__ == "__main__":
    main()
