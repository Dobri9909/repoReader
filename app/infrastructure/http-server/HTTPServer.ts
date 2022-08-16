import MainRouterFactory from '@interface/routes/MainRouterFactory';
import createExpressApp, { Express, NextFunction, Request, Response, static as staticRoute, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import ContentTypeHandlerFactory from '@infrastructure/http-server/middlewares/ContentTypeHandlerFactory';
import { determineEnvironment, Environment } from '@config';
import CORSHandlerFactory from '@infrastructure/http-server/middlewares/CORSHandlerFactory';
import path from 'path';
import API from '@interface/api/API';
import APIErrors from '@interface/api/APIErrors';
import NotFoundHandlerFactory from '@infrastructure/http-server/middlewares/NotFoundHandlerFactory';

export default class HTTPServer {
  private readonly expressApp: Express;

  constructor(
    private readonly config: {
      port: number;
    },
    private readonly mainRouterFactory: MainRouterFactory,
    private readonly appRoot: string,
  ) {
    this.expressApp = createExpressApp();

    this.initExpressApp();
  }

  private initExpressApp() {
    this.expressApp.use(bodyParser.json({ limit: '50mb' }) as RequestHandler);
    this.expressApp.use((new ContentTypeHandlerFactory()).create());

    const environment = determineEnvironment();

    if (environment === Environment.Development || environment === Environment.Staging) {
      const swaggerUIRoute = staticRoute(path.join(this.appRoot, 'node_modules', 'swagger-ui-dist'));

      this.expressApp.use('/docs', staticRoute(path.join(this.appRoot, 'docs')));
      this.expressApp.use('/docs/swagger-ui', swaggerUIRoute);

      if (environment === Environment.Staging) {
        this.expressApp.use('/docs/github/swagger-ui', swaggerUIRoute);
      }

      if (environment === Environment.Development) {
        this.expressApp.use((new CORSHandlerFactory()).create());
      }
    }
  
    this.expressApp.get('/', (req, res) => API.sendData(res, {}));
    this.expressApp.use('/v1', this.mainRouterFactory.createRouter());
    this.expressApp.use((new NotFoundHandlerFactory()).create());
    this.expressApp.use(this.createErrorHandler());
  }

  private createErrorHandler() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (error: Error, request: Request, response: Response, next: NextFunction) => {
      if (error instanceof SyntaxError) {
        return API.sendError(response, APIErrors.MALFORMED_REQUEST_BODY);
      }

      console.log(error);

      API.sendError(response, APIErrors.GENERAL_ERROR);
    };
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      const server = this.expressApp.listen(this.config.port);

      server.once('error', reject);
      server.once('listening', () => {
        server.removeListener('error', reject);

        const address = server.address();
        const bindAddress = typeof address === 'string' ? `pipe ${address}` : `port ${address?.port}`;

        console.log(`Listening on ${bindAddress}`);

        resolve();
      });
    });
  }

  getExpressApp(): Express {
    return this.expressApp;
  }
}
