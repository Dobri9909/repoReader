import RequestValidationError from '@interface/request/RequestValidationError';
import { Response } from 'express';
import APIError from './APIError';
import APIErrors from './APIErrors';

class API {
  static sendData(response: Response, data: unknown): void {
    response.send({
      data,
      error: null,
    });
  }

  static sendError(response: Response, error: APIError): void {
    response.status(error.status).send({
      data: null,
      error,
    });
  }

  static sendValidationError(response: Response, error: RequestValidationError): void {
    const apiError = APIErrors.INVALID_PARAMETERS;

    response.status(apiError.status).send({
      data: null,
      error: {
        ...apiError,
        validationErrors: error.errorItems,
      },
    });
  }
}

export default API;
