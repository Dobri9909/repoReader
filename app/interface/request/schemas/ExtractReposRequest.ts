import { Request } from 'express';

import { buildRequest } from '@interface/request/schemas/BaseRequest';
import ValidationErrorCodes from '@interface/api/ValidationErrorCodes';
import { makeNonEmptyString } from '@domain/types';

export default buildRequest({
  source: {
    required: true,
    extractor: (req: Request) => req.query.source,
    validator: makeNonEmptyString,
    code: ValidationErrorCodes.InvalidSource,
  },
  username: {
    required: true,
    extractor: (req: Request): unknown => req.query.username,
    validator: makeNonEmptyString,
    code: ValidationErrorCodes.InvalidUsername,
  },
});
