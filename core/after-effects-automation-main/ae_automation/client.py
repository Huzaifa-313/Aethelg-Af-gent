# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: after-effects-automation-main\ae_automation\client.py
# Merge Date: 2026-05-07T19:26:09.335911
# ---

from __future__ import annotations

from .mixins.VideoEditorApp import VideoEditorAppMixin


class Client(VideoEditorAppMixin):
    def __init__(self) -> None:
        super().__init__()
        # Any additional initialization for Client
