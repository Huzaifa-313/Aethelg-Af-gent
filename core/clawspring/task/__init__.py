# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: clawspring\task\__init__.py
# Merge Date: 2026-05-07T19:19:03.361686
# ---

"""Task system for clawspring."""
from .types import Task, TaskStatus
from .store import (
    create_task, get_task, list_tasks, update_task,
    delete_task, clear_all_tasks, reload_from_disk,
)

__all__ = [
    "Task", "TaskStatus",
    "create_task", "get_task", "list_tasks", "update_task",
    "delete_task", "clear_all_tasks", "reload_from_disk",
]
