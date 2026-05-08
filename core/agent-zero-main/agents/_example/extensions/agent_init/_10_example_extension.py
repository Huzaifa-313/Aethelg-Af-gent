# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\agents\_example\extensions\agent_init\_10_example_extension.py
# Merge Date: 2026-05-07T19:26:27.036429
# ---

from helpers.extension import Extension

# this is an example extension that renames the current agent when initialized
# see /extensions folder for all available extension points

class ExampleExtension(Extension):

    async def execute(self, **kwargs):
        # rename the agent to SuperAgent0
        self.agent.agent_name = "SuperAgent" + str(self.agent.number)
