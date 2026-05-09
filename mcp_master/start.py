#!/usr/bin/env python3
"""Simple launcher for the MCP Master server."""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def main():
    server_path = ROOT / "server.py"
    if not server_path.exists():
        print("[ERROR] server.py not found in mcp_master/")
        sys.exit(1)
    print("[INFO] Starting MCP Master server...")
    subprocess.run([sys.executable, str(server_path)])

if __name__ == "__main__":
    main()
