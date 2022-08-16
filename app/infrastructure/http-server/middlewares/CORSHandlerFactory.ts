import { MiddlewareFactory, RequestHandler } from '@infrastructure/http-server/middlewares/MiddlewareFactory';

export default class CORSHandlerFactory implements MiddlewareFactory {
  create(): RequestHandler {
    return (request, response, next) => {
      const allowedHeaders = [
        'Accept',
        'Access-Control-Allow-Credentials',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Origin',
        'Authorization',
        'Content-Type',
        'Headers',
        'Origin',
        'X-HTTP-Method-Override',
        'X-Requested-With',
      ];

      const allowedMethods = ['GET'];

      response.header('Access-Control-Allow-Credentials', 'true');
      response.header('Access-Control-Allow-Origin', request.headers.origin);
      response.header('Access-Control-Allow-Methods', allowedMethods.join(', '));
      response.header('Access-Control-Allow-Headers', allowedHeaders.join(', '));

      next();
    };
  }
}
