export function getConfigOption<T>(environmentVariableName: string, processor: (value: string) => T, defaultValue?: T): T {
  const value = process.env[environmentVariableName];

  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new Error(`Environment variable '${environmentVariableName}' is not defined and no default value was provided!`);
    }

    return defaultValue;
  }

  return processor(value);
}

export function stringOption(environmentVariableName: string, defaultValue?: string): string {
  return getConfigOption<string>(environmentVariableName, String, defaultValue);
}

export function integerOption(environmentVariableName: string, defaultValue?: number): number {
  return getConfigOption<number>(environmentVariableName, parseInt, defaultValue);
}
