# AETHELGARD MERGED FILE
# Origin Repository: OpenManus-main
# Original Path: src\tools\file_management.py
# Merge Date: 2026-05-07T19:14:12.835456
# ---

import logging
from langchain_community.tools.file_management import WriteFileTool
from .decorators import create_logged_tool

logger = logging.getLogger(__name__)

# Initialize file management tool with logging
LoggedWriteFile = create_logged_tool(WriteFileTool)
write_file_tool = LoggedWriteFile()