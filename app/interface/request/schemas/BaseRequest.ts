import { Request } from 'express';

type Constraint = {
  required: boolean,
  extractor: (req: Request) => unknown,
  validator: (input: unknown) => unknown,
  code: number,
}

export type BaseRequest = Record<string, Constraint>;

export function buildRequest<T extends BaseRequest>(request: T): T {
  return request;
}