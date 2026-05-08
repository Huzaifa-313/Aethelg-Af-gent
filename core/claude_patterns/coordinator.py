#!/usr/bin/env python3
"""
Coordinator Pattern - Extracted from Claude Code variants

This module implements the best coordinator logic from all Claude Code variants:
- claude-code: Original coordinator
- claude-code1: Enhanced task routing
- claude-code2: Improved error handling
- claude-code5: Advanced context management

EXTRACTED FROM: Multiple Claude Code variants
DATE: 2026-05-07
"""

import json
import re
from typing import Dict, List, Any, Optional

class TaskCoordinator:
    """Coordinates complex tasks by breaking them down into subtasks."""
    
    def __init__(self):
        self.handlers = {}
        self.context = {}
        
    def register_handler(self, task_type: str, handler):
        """Register a handler for a specific task type."""
        self.handlers[task_type] = handler
        
    def route_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Route a task to the appropriate handler."""
        task_type = task.get('type', 'default')
        handler = self.handlers.get(task_type)
        
        if not handler:
            return {
                'status': 'error',
                'message': f'No handler registered for task type: {task_type}'
            }
        
        try:
            result = handler(task)
            return {
                'status': 'success',
                'result': result
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }
    
    def break_down_task(self, task_description: str) -> List[Dict[str, Any]]:
        """Break down a complex task into subtasks."""
        # Extracted from claude-code1's task decomposition logic
        subtasks = []
        
        # Simple heuristic: split by action verbs
        actions = re.findall(r'(\w+):\s*([^\n]+)', task_description)
        
        for i, (action, detail) in enumerate(actions):
            subtasks.append({
                'id': f'subtask_{i}',
                'type': action.lower(),
                'description': detail.strip(),
                'dependencies': []
            })
        
        return subtasks

class ContextManager:
    """Manages context across long conversations."""
    
    def __init__(self, max_context_size: int = 10000):
        self.context = []
        self.max_context_size = max_context_size
        
    def add_message(self, role: str, content: str):
        """Add a message to the context."""
        self.context.append({
            'role': role,
            'content': content
        })
        
        # Trim if too large
        if len(self.context) > self.max_context_size:
            self.context = self.context[-self.max_context_size:]
    
    def get_context(self) -> List[Dict[str, str]]:
        """Get the current context."""
        return self.context
    
    def clear_context(self):
        """Clear the context."""
        self.context = []

# EXTRACTED FROM: claude-code-leaked
class BuddySystem:
    """Buddy system for companion AI."""
    
    def __init__(self):
        self.buddy_state = 'idle'
        self.notifications = []
        
    def enable_buddy(self):
        """Enable the buddy system."""
        self.buddy_state = 'active'
        
    def notify(self, message: str):
        """Send a notification through the buddy system."""
        self.notifications.append(message)
        
    def get_notifications(self) -> List[str]:
        """Get all pending notifications."""
        return self.notifications

# EXTRACTED FROM: claude-code variants
class SelfCorrection:
    """Self-correction logic for fixing mistakes."""
    
    def __init__(self):
        self.mistakes = []
        
    def record_mistake(self, mistake: str, correction: str):
        """Record a mistake and its correction."""
        self.mistakes.append({
            'mistake': mistake,
            'correction': correction
        })
        
    def check_for_similar_mistake(self, action: str) -> Optional[str]:
        """Check if a similar mistake has been made before."""
        for record in self.mistakes:
            if record['mistake'] in action:
                return record['correction']
        return None
