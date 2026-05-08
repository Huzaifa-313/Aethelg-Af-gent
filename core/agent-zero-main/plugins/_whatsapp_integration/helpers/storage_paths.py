# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_whatsapp_integration\helpers\storage_paths.py
# Merge Date: 2026-05-07T19:28:13.074396
# ---

"""Shared storage paths for the WhatsApp bridge."""

from helpers import files


def get_bridge_session_dir() -> str:
    return files.get_abs_path(files.TEMP_DIR, "whatsapp", "session")


def get_bridge_media_dir() -> str:
    return files.get_abs_path(files.TEMP_DIR, "whatsapp", "media")
