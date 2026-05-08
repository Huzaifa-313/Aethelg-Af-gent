# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\utils\todo\types.ts
# Merge Date: 2026-05-07T19:16:29.792456
# ---

// https://github.com/AnukarOP

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
