import ValidationErrorCodes from '@interface/api/ValidationErrorCodes';

export interface ErrorItem {
  code: ValidationErrorCodes;
  message: string;
  field: string;
}

export default class RequestValidationError extends Error {
  constructor(
    public readonly errorItems: Array<ErrorItem>,
  ) {
    super('RequestValidationError');
  }
}
