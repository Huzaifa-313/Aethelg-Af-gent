# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\extensions\python\_functions\agent\Agent\handle_exception\end\_40_handle_intervention_exception.py
# Merge Date: 2026-05-07T19:26:59.615981
# ---

from datetime import datetime, timezone
from helpers.extension import Extension
from agent import LoopData
from helpers.localization import Localization
from helpers.errors import InterventionException
from helpers import errors
from helpers.print_style import PrintStyle


class HandleInterventionException(Extension):
    async def execute(self, data: dict = {}, **kwargs):
        if not self.agent:
            return

        if not data.get("exception"):
            return

        if isinstance(data["exception"], InterventionException):
            data["exception"] = None # skip the exception and continue message loop

        
