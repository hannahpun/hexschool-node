import type { NextFunction, Request, Response } from 'express';
import { type ZodType } from 'zod';

const validate = (source: 'body' | 'params' | 'query', schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsedData = schema.safeParse(req[source]);
    if (!parsedData.success) {
      return res.status(400).json({
        error: parsedData.error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      });
    }
    if (source === 'query') {
      Object.assign(req.query, parsedData.data);
    }
    if (source === 'params') {
      Object.assign(req.params, parsedData.data);
    }
    if (source === 'params') {
      req.body = parsedData.data;
    }
    next();
  };
};

export { validate };
