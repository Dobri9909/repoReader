import { MiddlewareFactory, RequestHandler } from '@infrastructure/http-server/middlewares/MiddlewareFactory';
import API from '@interface/api/API';
import APIErrors from '@interface/api/APIErrors';

export default class NotFoundHandlerFactory implements MiddlewareFactory {
  create(): RequestHandler {
    return (request, response) => {
      API.sendError(response, APIErrors.NOT_FOUND);
    };
  }
}
