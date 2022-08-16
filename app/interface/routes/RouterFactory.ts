import { Router } from 'express';

interface RouterFactory {
  readonly basePath: string;

  createRouter(): Router;
}

export default RouterFactory;
