import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodSchema } from 'zod';

type Source = 'body' | 'query' | 'params';

export function validate<T>(schema: ZodSchema<T>, source: Source = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[source]);
      // Replace the source with the parsed/coerced data so downstream handlers get typed values.
      (req as unknown as Record<Source, unknown>)[source] = data;
      next();
    } catch (err) {
      if (err instanceof ZodError) return next(err);
      next(err);
    }
  };
}
