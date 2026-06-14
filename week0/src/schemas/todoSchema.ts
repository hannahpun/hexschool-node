import { z } from 'zod';

export const addTodoSchema = z.object({
  title: z.string().min(1, '標題不可為空'),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1, '標題不可為空'),
});

export const todoIdParamsSchema = z.object({
  id: z.string().min(1, 'ID 不可為空'),
});
