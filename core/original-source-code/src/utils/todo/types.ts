# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\utils\todo\types.ts
# Merge Date: 2026-05-07T19:19:53.497686
# ---

import { z } from 'zod/v4'
import { lazySchema } from '../lazySchema.js'

const TodoStatusSchema = lazySchema(() =>
  z.enum(['pending', 'in_progress', 'completed']),
)

export const TodoItemSchema = lazySchema(() =>
  z.object({
    content: z.string().min(1, 'Content cannot be empty'),
    status: TodoStatusSchema(),
    activeForm: z.string().min(1, 'Active form cannot be empty'),
  }),
)
export type TodoItem = z.infer<ReturnType<typeof TodoItemSchema>>

export const TodoListSchema = lazySchema(() => z.array(TodoItemSchema()))
export type TodoList = z.infer<ReturnType<typeof TodoListSchema>>
