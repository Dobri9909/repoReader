enum Environment {
  Development = 'development',
  Testing = 'testing',
  Staging = 'staging',
  Production = 'production',
}

interface Config {
  instance: string,
  server: {
    port: number;
  };
  gitHub: {
    token: string,
  }
}

export {
  Config,
  Environment,
};
