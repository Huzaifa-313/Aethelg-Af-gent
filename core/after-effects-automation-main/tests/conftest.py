# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: after-effects-automation-main\tests\conftest.py
# Merge Date: 2026-05-07T19:26:22.974429
# ---

"""
Test configuration and platform helpers
"""

import sys
import unittest

IS_WINDOWS = sys.platform == "win32"

skip_unless_windows = unittest.skipUnless(IS_WINDOWS, "Requires Windows")
