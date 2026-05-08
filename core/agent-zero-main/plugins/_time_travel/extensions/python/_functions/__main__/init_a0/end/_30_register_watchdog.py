# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_time_travel\extensions\python\_functions\__main__\init_a0\end\_30_register_watchdog.py
# Merge Date: 2026-05-07T19:28:10.048394
# ---

from __future__ import annotations

from helpers.extension import Extension
from plugins._time_travel.helpers.time_travel import register_watchdogs


class RegisterTimeTravelWatchdog(Extension):
    def execute(self, **kwargs):
        register_watchdogs()
