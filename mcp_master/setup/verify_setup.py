#!/usr/bin/env python3
"""Setup Verification Script

Checks that all dependencies are available for mcp_master.
Works on Windows, macOS, and Linux.
"""

import sys
import os
import subprocess
import platform

# Detect OS
OS_NAME = platform.system().lower()
IS_WINDOWS = OS_NAME == 'windows'
IS_MAC = OS_NAME == 'darwin'
IS_LINUX = OS_NAME == 'linux'

def check_python_package(package):
    """Check if a Python package is installed."""
    try:
        __import__(package)
        return True, f"{package} installed"
    except ImportError:
        return False, f"{package} NOT installed"

def check_command(command, description):
    """Check if a system command is available."""
    try:
        if IS_WINDOWS:
            result = subprocess.run(['where', command], capture_output=True, text=True, check=True)
        else:
            result = subprocess.run(['which', command], capture_output=True, text=True, check=True)
        return True, f"{description} found"
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False, f"{description} NOT found"

def main():
    print("=" * 60)
    print("MCP Master Setup Verification")
    print("=" * 60)
    print(f"OS: {platform.system()} {platform.release()}")
    print(f"Python: {sys.version}")
    print()
    
    checks = {
        "Python Version": (sys.version_info >= (3, 8), f"Python {sys.version_info.major}.{sys.version_info.minor}"),
        "Node.js": check_command('node', 'Node.js'),
        "npm": check_command('npm', 'npm'),
        "Git": check_command('git', 'Git'),
        "Docker": check_command('docker', 'Docker'),
    }
    
    # Check Python packages
    python_packages = ['yaml', 'requests', 'json', 'subprocess']
    for pkg in python_packages:
        if pkg in ['json', 'subprocess']:
            checks[f"Python {pkg}"] = (True, f"Built-in module")
        else:
            success, msg = check_python_package(pkg)
            checks[f"Python {pkg}"] = (success, msg)
    
    # Print results
    passed = 0
    failed = 0
    
    for name, (success, msg) in checks.items():
        status = "PASS" if success else "FAIL"
        symbol = " " if success else "X"
        print(f"[{symbol}] {name}: {msg}")
        if success:
            passed += 1
        else:
            failed += 1
    
    print()
    print("=" * 60)
    print(f"Results: {passed} passed, {failed} failed")
    if failed == 0:
        print("All checks passed! Ready to start.")
    else:
        print("Some checks failed. Please install missing dependencies.")
    print("=" * 60)
    
    return failed == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
