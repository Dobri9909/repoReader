import { Router } from 'express';
import RouterFactory from './RouterFactory';
import ReaderController from '../controllers/ReaderController';
import { createAsyncExpressHandler } from '@interface/routes/ExpressAsyncHandlerFactory';

export default class ReaderRouterFactory implements RouterFactory {
  basePath = '/';

  constructor(
    private readerController: ReaderController,
  ) {}

  createRouter(): Router {
    const router = Router();

    router.get(
      '/listRepositories',
      createAsyncExpressHandler(this.readerController.listRepositories),
    );

    return router;
  }
}
