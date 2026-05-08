# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\extensions\python\_functions\__main__\init_a0\end\_10_register_watchdogs.py
# Merge Date: 2026-05-07T19:27:00.029982
# ---

from helpers.extension import Extension


class RegisterWatchDogs(Extension):

    def execute(self, **kwargs):
        from helpers.plugins import register_watchdogs as register_plugins_watchdogs
        from helpers.api import register_watchdogs as register_api_watchdogs

        register_plugins_watchdogs()
        register_api_watchdogs()