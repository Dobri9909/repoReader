import API from '@interface/api/API';
import APIErrors from '@interface/api/APIErrors';
import { MiddlewareFactory, RequestHandler } from '@infrastructure/http-server/middlewares/MiddlewareFactory';

export default class ContentTypeHandlerFactory implements MiddlewareFactory {
  create(): RequestHandler {
    return (request, response, next) => {
      if (
        request.method === 'GET'
      ) {
        return next();
      }

      if (!request.is('application/json')) {
        return API.sendError(response, APIErrors.INVALID_CONTENT_TYPE);
      }

      next();
    };
  }
}
