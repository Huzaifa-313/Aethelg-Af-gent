# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: python\tests\conftest.py
# Merge Date: 2026-05-07T19:21:48.106307
# ---

from pathlib import Path
import sys

# Make the sibling `python/` helper modules importable from this test package.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
