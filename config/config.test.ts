import { Config } from './Config';
import { integerOption, stringOption } from './options';
import { config as loadDotConfig } from 'dotenv';

loadDotConfig();
const config: Config = {
  instance: 'repository-reader',
  server: {
    port: integerOption('PORT', 3000),
  },
  gitHub: {
    token: stringOption('GITHUB_TOKEN'),
  },
};

export default config;
