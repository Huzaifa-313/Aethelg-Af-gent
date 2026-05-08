# AETHELGARD MERGED FILE
# Origin Repository: OpenManus-main
# Original Path: src\tools\browser.py
# Merge Date: 2026-05-07T19:14:12.249455
# ---

from langchain.tools import BaseTool

class BrowserTool(BaseTool):
    name: str = "browser"
    description: str = "Placeholder browser tool"

    def _run(self, instruction: str) -> str:
        return "Browser tool placeholder"

    async def _arun(self, instruction: str) -> str:
        return "Browser tool placeholder"

browser_tool = BrowserTool()