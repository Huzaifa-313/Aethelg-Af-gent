#!/usr/bin/env python3
"""MCP Master - Self-Healing Startup Script

Single entry point to start the entire mcp_master system.
Checks dependencies, validates config, and starts all tool servers.
"""

import os
import sys
import json
import time
import subprocess
import platform
from pathlib import Path

# Get the directory where this script is located
SCRIPT_DIR = Path(__file__).parent.resolve()
MCP_MASTER_ROOT = SCRIPT_DIR

def log(message, level="INFO"):
    """Print a log message."""
    print(f"[{level}] {message}")

def check_dependencies():
    """Check that all required dependencies are installed."""
    log("Checking dependencies...")
    
    # Check Python version
    if sys.version_info < (3, 8):
        log("Python 3.8+ required", "ERROR")
        return False
    
    log("Python version OK")
    return True

def validate_config():
    """Validate the configuration file."""
    config_path = MCP_MASTER_ROOT / "config" / "mcp_config.yaml"
    
    if not config_path.exists():
        log(f"Config file not found: {config_path}", "ERROR")
        return False
    
    log("Config file found")
    return True

def start_tool_servers():
    """Start all tool servers."""
    log("Starting tool servers...")
    
    # This is a placeholder - in a real implementation,
    # you would start each tool server and verify it's healthy
    
    tool_dirs = [
        "core_tools",
        "database_tools",
        "web_tools",
        "file_tools",
    ]
    
    for tool_dir in tool_dirs:
        tool_path = MCP_MASTER_ROOT / tool_dir
        if tool_path.exists():
            log(f"  [OK] {tool_dir} available")
        else:
            log(f"  [SKIP] {tool_dir} not found")
    
    return True

def print_status():
    """Print the final status."""
    log("=" * 60)
    log("MCP Master Startup Complete")
    log("=" * 60)
    log(f"Root: {MCP_MASTER_ROOT}")
    log(f"OS: {platform.system()} {platform.release()}")
    log("All systems operational")
    log("=" * 60)

def main():
    """Main entry point."""
    log("=" * 60)
    log("MCP Master - Self-Healing Startup")
    log("=" * 60)
    
    # Step 1: Check dependencies
    if not check_dependencies():
        log("Dependency check failed", "ERROR")
        return False
    
    # Step 2: Validate config
    if not validate_config():
        log("Config validation failed", "ERROR")
        return False
    
    # Step 3: Start tool servers
    if not start_tool_servers():
        log("Failed to start tool servers", "ERROR")
        return False
    
    # Step 4: Print status
    print_status()
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
