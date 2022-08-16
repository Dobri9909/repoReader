import ValidationError from '@interface/request/RequestValidationError';
import APIError from './APIError';

type APIValidationError = APIError & {
  validationErrors: Array<ValidationError>;
}

export default APIValidationError;
