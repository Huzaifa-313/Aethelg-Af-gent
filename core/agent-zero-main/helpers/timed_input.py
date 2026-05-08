# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\helpers\timed_input.py
# Merge Date: 2026-05-07T19:27:11.802980
# ---

import sys
from inputimeout import inputimeout, TimeoutOccurred

def timeout_input(prompt, timeout=10):
    try:
        if sys.platform != "win32": import readline
        user_input = inputimeout(prompt=prompt, timeout=timeout)
        return user_input
    except TimeoutOccurred:
        return ""