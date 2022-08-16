import { Config } from './Config';
import { config as loadDotConfig } from 'dotenv';
import { integerOption, stringOption } from './options';

loadDotConfig();

const config: Config = {
  instance: 'repository-reader',
  server: {
    port: integerOption('PORT', 3015),
  },
  gitHub: {
    token: stringOption('GITHUB_TOKEN'),
  },
};

export default config;
