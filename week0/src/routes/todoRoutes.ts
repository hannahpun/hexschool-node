import { Router } from 'express';
import { validateBody, validateParams } from '@/middlewares/validate.ts';
import { addTodoSchema, updateTodoSchema, todoIdParamsSchema } from '@/schemas/todoSchema.ts';
import { HttpError } from '@/utils/HttpError.ts';

const router = Router();
type Todo = {
  id: number;
  title: string;
};

let todos: Todo[] = [
  {
    id: 1,
    title: '吃飯',
  },
];

router.get('/', (_req, res) => {
  res.json({
    status: 'success',
    data: todos,
  });
});

router.post('/', validateBody(addTodoSchema), (req, res) => {
  const { title } = req.body;
  const newTodo: Todo = {
    id: todos.length + 1,
    title,
  };

  todos = [...todos, newTodo];

  res.json({
    status: 'success',
    data: todos,
  });
});

router.patch(
  '/:id/',
  validateParams(todoIdParamsSchema),
  validateBody(updateTodoSchema),
  (req, res) => {
    const { id } = req.params;
    const targetIndex = todos.findIndex((todo) => todo.id === Number(id));
    if (targetIndex === -1) {
      throw new HttpError(404, '無此 todo 資訊');
    }
    const { title } = req.body;
    todos = todos.map((todo: Todo) => {
      if (todo.id === Number(id)) {
        return {
          ...todo,
          title,
        };
      }
      return todo;
    });

    res.json({
      status: 'success',
      data: todos,
    });
  },
);

router.delete('/', (_req, res) => {
  todos.length = 0;
  res.json({
    status: 'success',
    data: todos,
  });
});

router.delete('/:id', validateParams(todoIdParamsSchema), (req, res) => {
  const { id } = req.params;
  const targetIndex = todos.findIndex((todo) => todo.id === Number(id));
  if (targetIndex === -1) {
    throw new HttpError(404, '無此 todo 資訊');
  }
  todos.splice(targetIndex, 1);
  res.json({
    status: 'success',
    data: todos,
  });
});

export default router;
