/* eslint key-spacing: ["error", { "afterColon": true, "align": "value" }] */

export type APIError = {
  status: number,
  code: number,
  message: string,
};

const APIErrors: Record<string, APIError> = {
  GENERAL_ERROR:          { status: 500, code: 1000, message: 'General error (don\'t know what happened).' },
  INVALID_PARAMETERS:     { status: 400, code: 1001, message: 'Mandatory parameters not provided or of incorrect type.' },
  INVALID_CONTENT_TYPE:   { status: 406, code: 1002, message: 'Invalid Content-Type - must be application/json.' },
  NOT_FOUND:              { status: 404, code: 1003, message: 'Not found.' },
  MALFORMED_REQUEST:      { status: 400, code: 1004, message: 'Malformed request' },
  MALFORMED_REQUEST_BODY: { status: 400, code: 1005, message: 'Malformed request body.' },
  USER_REPOS_NOT_FOUND:   { status: 404, code: 1008, message: 'No repositories for that user found.' },
  CLIENT_NOT_FOUND:       { status: 404, code: 1009, message: 'Cannot determine client based on that source' },
};

export default APIErrors;

