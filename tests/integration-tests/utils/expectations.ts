import 'jest-extended';
import { Response } from './ApiClient';

type ValidationError = {
  code: number,
  field: string,
}

export function expectValidationError(
  { body, status }: Response,
  validationErrors: Array<ValidationError>,
): void {
  expect(status).toEqual(400);
  expect(body.data).toEqual(null);
  expect(body.error.code).toEqual(1001);
  expect(body.error.status).toEqual(400);
  expect(body.error.validationErrors).toBeArray();
  expect(body.error.validationErrors.length).toBeGreaterThan(0);

  for (const validationError of validationErrors) {
    expect(body.error.validationErrors).toEqual(
      expect.arrayContaining([
        expect.objectContaining(validationError),
      ]),
    );
  }
}
