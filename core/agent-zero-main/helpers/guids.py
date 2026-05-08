# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\helpers\guids.py
# Merge Date: 2026-05-07T19:27:04.249980
# ---

import random, string

def generate_id(length: int = 8) -> str:
    return "".join(random.choices(string.ascii_letters + string.digits, k=length))
