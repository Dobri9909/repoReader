import { inspect } from 'util';

export type Nominal<Type, Brand extends string> = Type & {
  readonly __brand: Brand,
};

export function createTypeError(expectedType: string, receivedInput: unknown): TypeError {
  return new TypeError(`Expected: ${expectedType}, received: ${inspect(receivedInput)}`);
}

export type NonEmptyString = Nominal<string, 'NonEmptyString'>;
export function isNonEmptyString(input: unknown): input is NonEmptyString {
  return typeof input === 'string' && input.length > 0;
}

export function makeNonEmptyString(input: unknown): NonEmptyString {
  if (!isNonEmptyString(input)) {
    throw createTypeError('non-empty string', input);
  }

  return input;
}

export function isNumberObject(input: unknown): input is number {
  return typeof input === 'number' && !Number.isNaN(input) && Number.isFinite(input);
}

export type PositiveNumber = Nominal<number, 'PositiveNumber'>;
export function isPositiveNumber(input: unknown): input is PositiveNumber {
  return isNumberObject(input) && input > 0;
}

export function makePositiveNumber(input: unknown): PositiveNumber {
  if (!isPositiveNumber(input)) {
    throw createTypeError('positive number', input);
  }

  return input;
}

export type PlainObject = Record<string, unknown>;
export function isPlainObject(input: unknown): input is PlainObject {
  return (
    typeof input === 'object' &&
    input !== null &&
    !Array.isArray(input)
  );
}

export function makePlainObject(input: unknown): PlainObject {
  if (!isPlainObject(input)) {
    throw createTypeError('PlainObject', input);
  }

  return input;
}
