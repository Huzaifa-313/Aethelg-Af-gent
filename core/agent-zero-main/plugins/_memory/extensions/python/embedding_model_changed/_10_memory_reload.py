# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_memory\extensions\python\embedding_model_changed\_10_memory_reload.py
# Merge Date: 2026-05-07T19:27:40.801396
# ---

from helpers.extension import Extension

# Direct import - this extension lives inside the memory plugin
from plugins._memory.helpers.memory import reload as memory_reload


class MemoryReload(Extension):

    async def execute(self, **kwargs):
        memory_reload()
