import { Router as ExpressRouter, Router as createExpressRouter } from 'express';
import RouterFactory from './RouterFactory';

class MainRouterFactory {
  constructor(private readonly routerFactories: Array<RouterFactory>) {}

  createRouter(): ExpressRouter {
    const router = createExpressRouter();

    for (const childRouterFactory of this.routerFactories) {
      router.use(childRouterFactory.basePath, childRouterFactory.createRouter());
    }

    return router;
  }
}

export default MainRouterFactory;
