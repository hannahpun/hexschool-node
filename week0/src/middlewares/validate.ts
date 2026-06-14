import type { Request, Response, NextFunction } from 'express';
import { type ZodType } from 'zod';

type Source = 'body' | 'params';

const validate = (source: Source) => (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        errors: result.error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      });
    }
    if (source === 'params') {
      Object.assign(req.params, result.data);
    } else {
      req.body = result.data;
    }
    next();
  };
};

const validateBody = validate('body');
const validateParams = validate('params');
export { validateBody, validateParams };
