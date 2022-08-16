import { NextFunction, Request, RequestHandler, Response } from 'express';

export function createAsyncExpressHandler(handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = handler(req, res, next);

      if (result instanceof Promise) {
        result.catch(next);
      }
    } catch (error) {
      next(error);
    }
  };
}
