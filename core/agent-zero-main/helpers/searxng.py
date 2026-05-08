# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\helpers\searxng.py
# Merge Date: 2026-05-07T19:27:09.285982
# ---

import aiohttp
from helpers import runtime

URL = "http://localhost:55510/search"

async def search(query:str):
    return await runtime.call_development_function(_search, query=query)

async def _search(query:str):
    async with aiohttp.ClientSession() as session:
        async with session.post(URL, data={"q": query, "format": "json"}) as response:
            return await response.json()
