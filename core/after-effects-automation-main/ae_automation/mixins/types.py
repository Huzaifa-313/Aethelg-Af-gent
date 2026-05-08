# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: after-effects-automation-main\ae_automation\mixins\types.py
# Merge Date: 2026-05-07T19:26:17.011430
# ---

from pydantic import BaseModel, Field


class ae_files(BaseModel):
    id: int
    name: str
    type: str


class ae_bot(BaseModel):
    projectName: str
    files: list[ae_files] = Field(default_factory=list)
