#!/usr/bin/env python3
"""Install Everything Script

Detects OS and installs all dependencies for mcp_master.
Works on Windows, macOS, and Linux.
"""

import sys
import os
import subprocess
import platform
import json

OS_NAME = platform.system().lower()
IS_WINDOWS = OS_NAME == 'windows'

def run_command(cmd, description):
    """Run a command and print status."""
    print(f"Installing {description}...")
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        print(f"  [OK] {description} installed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"  [FAIL] {description}: {e}")
        return False

def install_python_deps():
    """Install Python dependencies from requirements.txt."""
    req_file = os.path.join(os.path.dirname(__file__), '..', 'requirements.txt')
    if os.path.exists(req_file):
        return run_command(f"{sys.executable} -m pip install -r {req_file}", "Python dependencies")
    else:
        print("  [SKIP] requirements.txt not found")
        return True

def install_node_deps():
    """Install Node.js dependencies from package.json."""
    pkg_file = os.path.join(os.path.dirname(__file__), '..', 'package.json')
    if os.path.exists(pkg_file):
        return run_command("npm install", "Node.js dependencies")
    else:
        print("  [SKIP] package.json not found")
        return True

def main():
    print("=" * 60)
    print("MCP Master - Install Everything")
    print("=" * 60)
    print(f"OS: {platform.system()} {platform.release()}")
    print()
    
    results = {
        "Python deps": install_python_deps(),
        "Node deps": install_node_deps(),
    }
    
    print()
    print("=" * 60)
    print("Installation Summary")
    print("=" * 60)
    
    for name, success in results.items():
        status = "PASS" if success else "FAIL"
        print(f"  [{status}] {name}")
    
    if all(results.values()):
        print("\nAll installations successful!")
        return True
    else:
        print("\nSome installations failed. Check output above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
