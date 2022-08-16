import { Config, Environment } from './Config';
export * from './Config';

export function determineEnvironment(): Environment {
  switch (process.env.NODE_ENV) {
    case 'testing':
      return Environment.Testing;
    case 'staging':
      return Environment.Staging;
    case 'production':
      return Environment.Production;
    default:
      return Environment.Development;
  }
}

export function loadConfig(): Config {
  let configPath: string;

  switch (determineEnvironment()) {
    case Environment.Production:
      configPath = './config.prod';
      break;
    case Environment.Testing:
      configPath = './config.test';
      break;
    case Environment.Staging:
      configPath = './config.stage';
      break;
    default:
      configPath = './config.dev';
      break;
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(configPath).default;
}
