# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_model_config\extensions\python\_functions\agent\Agent\get_utility_model\start\_10_model_config.py
# Merge Date: 2026-05-07T19:27:45.122395
# ---

from helpers.extension import Extension
from plugins._model_config.helpers.model_config import build_utility_model


class UtilityModelProvider(Extension):
    def execute(self, data: dict = {}, **kwargs):
        if self.agent:
            data["result"] = build_utility_model(self.agent)
