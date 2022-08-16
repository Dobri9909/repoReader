interface APIError {
  status: number;
  code: number;
  message: string;
  validationErrors?: Record<string, unknown>,
}

export default APIError;
