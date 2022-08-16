import { Request as ExpressRequest } from 'express';
import RequestValidationError, { ErrorItem } from './RequestValidationError';
import { BaseRequest } from './schemas/BaseRequest';

type ExtractReturnType<CustomRequest extends BaseRequest> = {
  [K in keyof CustomRequest as CustomRequest[K]['required'] extends true ? K : never]: ReturnType<CustomRequest[K]['validator']>
} & {
  [K in keyof CustomRequest as CustomRequest[K]['required'] extends false ? K : never]?: ReturnType<CustomRequest[K]['validator']>
}

class RequestValidator {
  validate<
    CustomRequest extends BaseRequest,
    ReturnType = ExtractReturnType<CustomRequest>
  >(req: ExpressRequest, request: CustomRequest): ReturnType {
    const validatedInput: Record<string, unknown> = {};
    const errorItems: Array<ErrorItem> = [];

    for (const key in request) {
      try {
        const value = request[key].extractor(req);
        if (!request[key].required && value === undefined) {
          continue;
        }

        const validator = request[key].validator;
        validator(value);
        validatedInput[key] = value;
      } catch (err) {
        errorItems.push({
          code: request[key].code,
          message: err.message,
          field: key,
        });
      }
    }

    if (errorItems.length) {
      throw new RequestValidationError(errorItems);
    }

    return validatedInput as ReturnType;
  }
}

export default RequestValidator;
